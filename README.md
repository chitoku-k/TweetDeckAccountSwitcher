TweetDeck Accounts Switcher
==========================

[![][travis-badge]][travis-link]
[![][appveyor-badge]][appveyor-link]
[![][dependencies-badge]][dependencies-link]

TweetDeck のアカウント選択を複数選択ではなく切り替えになるように拡張します。  
新規ツイートでの選択とリツイートのダイアログでの選択の両方に対応しています。

<img src="https://raw.githubusercontent.com/wiki/chitoku-k/TweetDeckAccountsSwitcher/tweetdeck_account_switcher_enabled.gif" alt="サンプル" width="256">

## インストール

Chrome でウェブストアを開き [CHROME に追加] をクリックします。  
[TweetDeck Accounts Switcher - Chrome ウェブストア](https://chrome.google.com/webstore/detail/tweetdeck-accounts-switch/cjnfkpniglbbhifpkfnclpndpbhmfllh)

## テスト

### 環境の準備

Selenium を使用した自動テストを実行するには次の環境を準備します。

- Node.js v9 以上
- Google Chrome
- TweetDeck のユーザー名とパスワード（テスト用推奨）
- GUI 環境または X virtual framebuffer などの仮想ディスプレイ

### 環境の構築

次のコマンドを実行して必要なパッケージをインストールします。

```bash
$ npm install
```

### 実行

コマンドを実行すると Chrome が自動で起動/終了してパッケージを生成し動作を確認します。

#### Linux/macOS の場合

```bash
$ export TEST_TWITTER_USERNAME='<Your TweetDeck Username>'
$ export TEST_TWITTER_PASSWORD='<Your TweetDeck Password>'
$ npm test
```

#### Windows の場合

```dos
> SET TEST_TWITTER_USERNAME=<Your TweetDeck Username>
> SET TEST_TWITTER_PASSWORD=<Your TweetDeck Password>
> npm test
```

[travis-link]:          https://travis-ci.org/chitoku-k/TweetDeckAccountsSwitcher
[travis-badge]:         https://img.shields.io/travis/chitoku-k/TweetDeckAccountsSwitcher.svg?style=flat-square&label=mac%2Flinux
[appveyor-link]:        https://ci.appveyor.com/project/chitoku-k/tweetdeckaccountsswitcher
[appveyor-badge]:       https://img.shields.io/appveyor/ci/chitoku-k/TweetDeckAccountsSwitcher.svg?style=flat-square&label=windows
[dependencies-link]:    https://gemnasium.com/github.com/chitoku-k/TweetDeckAccountsSwitcher
[dependencies-badge]:   https://img.shields.io/gemnasium/chitoku-k/TweetDeckAccountsSwitcher.svg?style=flat-square
