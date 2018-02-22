TweetDeck Accounts Switcher
==========================

[![][travis-badge]][travis-link]
[![][appveyor-badge]][appveyor-link]
[![][dependencies-badge]][dependencies-link]

TweetDeck のアカウント選択を複数選択ではなく切り替えになるように拡張します。  
新規ツイートでの選択とリツイートのダイアログでの選択の両方に対応しています。

<img src="https://raw.githubusercontent.com/wiki/chitoku-k/TweetDeckAccountsSwitcher/tweetdeck_account_switcher_enabled.gif" alt="サンプル" width="256">

## インストール

TweetDeck のアカウント選択は 2018/02/21 に Twitter のポリシーによって複数選択から切り替えに変更され、当拡張機能は役目を終えることとなりました。
今後は Twitter の仕様変更に対応しないため、ソースコードはテストを含め正常に動作しなくなると思われます。

詳細は [Automation and the use of multiple accounts][twitter-blog-link] をご確認ください。

## テスト

### 環境の準備

Selenium を使用した自動テストを実行するには次の環境を準備します。

- Node.js v9 以上
- Google Chrome または Firefox Developer Edition
- TweetDeck のユーザー名とパスワード（テスト用推奨）
- GUI 環境または X virtual framebuffer などの仮想ディスプレイ

### 環境の構築

次のコマンドを実行して必要なパッケージをインストールします。

```bash
$ npm install
```

### 実行

コマンドを実行すると Chrome/Firefox が自動で起動/終了してパッケージを生成し動作を確認します。<br>
`BROWSER` は `chrome` または `firefox` を指定します。

#### Linux/macOS の場合

```bash
$ export TEST_TWITTER_USERNAME='<Your TweetDeck Username>'
$ export TEST_TWITTER_PASSWORD='<Your TweetDeck Password>'
$ export BROWSER='chrome'
$ npm test
```

#### Windows の場合

```dos
> SET TEST_TWITTER_USERNAME=<Your TweetDeck Username>
> SET TEST_TWITTER_PASSWORD=<Your TweetDeck Password>
> SET BROWSER=chrome
> npm test
```

[travis-link]:          https://travis-ci.org/chitoku-k/TweetDeckAccountsSwitcher
[travis-badge]:         https://img.shields.io/travis/chitoku-k/TweetDeckAccountsSwitcher/master.svg?style=flat-square&label=mac%2Flinux
[appveyor-link]:        https://ci.appveyor.com/project/chitoku-k/tweetdeckaccountsswitcher
[appveyor-badge]:       https://img.shields.io/appveyor/ci/chitoku-k/TweetDeckAccountsSwitcher/master.svg?style=flat-square&label=windows
[dependencies-link]:    https://gemnasium.com/github.com/chitoku-k/TweetDeckAccountsSwitcher
[dependencies-badge]:   https://img.shields.io/gemnasium/chitoku-k/TweetDeckAccountsSwitcher.svg?style=flat-square
[twitter-blog-link]:    https://blog.twitter.com/developer/en_us/topics/tips/2018/automation-and-the-use-of-multiple-accounts.html
