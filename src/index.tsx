import React from "react"
import useScript from "react-script-hook"

export type SliseAdProps = {
	slotId: string
	pub: `pub-${number}`
	format: string

	style?: React.CSSProperties
}

export const SliseAd: React.FC<SliseAdProps> = props => 
{
	const addSlot = React.useCallback(() => 
	{
		const wnd = window
		; (wnd.adsbyslise = wnd.adsbyslise || []).push({ slot: props.slotId })
		wnd.adsbyslisesync && wnd.adsbyslisesync()
	}, [props.slotId, props.format])

	React.useEffect(() => 
	{
		addSlot()
	}, [addSlot])
	const [_loading, _error] = useScript({
		src: "https://v1.slise.xyz/scripts/embed.js",
		checkForExisting: true,
	})
	return (
		<ins
			className="adsbyslise"
			style={props.style}
			data-ad-slot={props.slotId}
			data-ad-pub={props.pub}
			data-ad-format={props.format}
		></ins>
	)
}
