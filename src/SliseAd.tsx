"use client"

import React, {
	CSSProperties,
	FC,
	useCallback,
	useEffect,
	useState,
	useRef,
} from "react"
import useScript from "react-script-hook"

export type SliseAdProps = {
	slotId: string
	pub: `pub-${number}`
	format: string

	requireLocalScript?: () => void
	onError?: (error: Error) => void
	onLoading?: (loading: boolean) => void

	style?: CSSProperties
	__overrideSliseHost?: string
}

type SliseAdState = {
	frameLoading: boolean
	frameError?: ErrorEvent
	requireError?: Error
	requireInProgress: boolean
}

const DEFAULT_SLISE_HOST = "https://v1.slise.xyz"
const OBSERVER_CONFIG = { childList: true, subtree: true }

export const SliseAd: FC<SliseAdProps> = props => {
	const {
		slotId,
		pub,
		format,
		requireLocalScript,
		onError,
		onLoading,
		style,
		__overrideSliseHost,
	} = props
	const host = __overrideSliseHost || DEFAULT_SLISE_HOST

	const rootRef = useRef<HTMLModElement>(null)
	const [
		{ frameLoading, frameError, requireError, requireInProgress },
		setState,
	] = useState<SliseAdState>({
		frameLoading: false,
		requireInProgress: false,
	})
	const [scriptLoading, scriptHookError] = useScript({
		src: `${host}/scripts/embed.js`,
		checkForExisting: true,
		async: true,
	})
	const loading =
		frameLoading || (scriptLoading && !scriptHookError) || requireInProgress
	const error: Error = frameError?.error ?? requireError

	const addSlot = useCallback(() => {
		const wnd = window
		;(wnd.adsbyslise = wnd.adsbyslise || []).push({ slot: slotId })
		wnd.adsbyslisesync && wnd.adsbyslisesync()
	}, [slotId, format])

	const handleFrameLoadStart = useCallback(() => {
		setState(state => ({ ...state, frameLoading: true }))
	}, [])
	const handleFrameLoadEnd = useCallback(() => {
		setState(state => ({ ...state, frameLoading: false }))
	}, [])
	const handleFrameError = useCallback((e: ErrorEvent) => {
		setState(state => ({ ...state, frameError: e, frameLoading: false }))
	}, [])
	const handleTreeMutation = useCallback((mutations: MutationRecord[]) => {
		const addedIframe = mutations.flatMap(mutation => {
			const matchingNodes: HTMLIFrameElement[] = []
			mutation.addedNodes.forEach(node => {
				if (node instanceof HTMLIFrameElement && node.src?.startsWith(host)) {
					matchingNodes.push(node)
				}
			})

			return matchingNodes
		})[0]

		if (addedIframe) {
			setState(state => ({ ...state, frameLoading: true }))
			addedIframe.addEventListener("loadstart", handleFrameLoadStart)
			addedIframe.addEventListener("load", handleFrameLoadEnd)
			addedIframe.addEventListener("error", handleFrameError)
		}
	}, [])
	const observerRef = useRef<MutationObserver>(
		new MutationObserver(handleTreeMutation)
	)
	useEffect(() => {
		if (rootRef.current) {
			observerRef.current.observe(rootRef.current, OBSERVER_CONFIG)

			return () => observerRef.current.disconnect()
		}
	}, [])

	useEffect(() => {
		if (scriptHookError && requireLocalScript) {
			try {
				setState(state => ({
					...state,
					requireInProgress: true,
					requireError: undefined,
				}))
				requireLocalScript()
				setState(state => ({ ...state, requireInProgress: false }))
			} catch (e) {
				console.error(e)
				setState(state => ({
					...state,
					requireInProgress: false,
					requireError: e as Error,
				}))
			}
		} else if (scriptHookError) {
			setState(state => ({
				...state,
				requireInProgress: false,
				requireError: new Error(
					"requireLocalScript is not defined, failed to load remote script"
				),
			}))
		}
	}, [scriptHookError, requireLocalScript])

	useEffect(() => addSlot(), [addSlot])
	useEffect(() => onLoading?.(loading), [loading, onLoading])
	useEffect(() => error && onError?.(error), [error, onError])

	return (
		<ins
			className="adsbyslise"
			style={style}
			data-ad-slot={slotId}
			data-ad-pub={pub}
			data-ad-format={format}
			ref={rootRef}
		>
			<div
				style={{
					width: style?.width,
					height: style?.height,
					maxWidth: style?.maxWidth,
					maxHeight: style?.maxHeight,
					minWidth: style?.minWidth,
					minHeight: style?.minHeight,
				}}
			></div>
		</ins>
	)
}
