# @temple-wallet/slise-embed-react

[![npm package](https://img.shields.io/npm/v/@temple-wallet/slise-embed-react)](https://www.npmjs.com/package/@temple-wallet/slise-embed-react)
[![Build Status](https://github.com/madfish-solutions/tw-embed-react/actions/workflows/release.yml/badge.svg)](https://github.com/madfish-solutions/tw-embed-react/actions/workflows/release.yml)
[![Downloads](https://img.shields.io/npm/dt/@temple-wallet/slise-embed-react)](https://www.npmtrends.com/@temple-wallet/slise-embed-react)
[![Issues](https://img.shields.io/github/issues/madfish-solutions/tw-embed-react)](https://github.com/madfish-solutions/tw-embed-react/issues)
[![Code Coverage](https://codecov.io/gh/madfish-solutions/tw-embed-react/branch/main/graph/badge.svg)](https://codecov.io/gh/madfish-solutions/tw-embed-react)
[![Commitizen Friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Semantic Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> React component to embed Slise into your website or web extension

## Install

```bash
npm install @temple-wallet/slise-embed-react
```
or
```bash
yarn add @temple-wallet/slise-embed-react
```

## Usage

```ts
import { SliseAd } from '@temple-wallet/slise-embed-react'

export const App: React.FC = () => {
    return (
        <div>
            <p>Leaderboard example:</p>
            <SliseAd
                style = {{ display: "inline-block", width: "728px", height: "90px" }}
                slotId = "1"
                pub = "pub-12345"
                format = "728x90,364x45"
            />
        </div>
    )
}
```

## API

### type SliseAdProps

#### slotId

Type: `string`

Unique ID of the slot across all the pages on your website.

#### pub

Type: `string`

Publisher ID (provided by Slise).

#### format

Type: `string`

Comma-separated list of the ad formats that you want to be shown in this slot.

#### requireLocalScript

Type: `() => void`

If the function is specified, it will be called in case script loading from v1.slise.xyz fails in order to initialize ads.

#### onError

Type: `(error: Error) => void`

This callback is called if loading ads fails.

#### onLoading

Type: `(loading: boolean) => void`

This callback is called after ads start or finish loading.

#### style?

Type: `React.CSSProperties`

You can add any valid React CSS styles to the ad.

### SliseAd(props: SliseAdProps)

Displays Slise ad in an iframe.

