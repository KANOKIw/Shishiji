//@ts-check
"use strict";


/**
 * @typedef {import("./shishiji-dts/objects").LanguageComponent} LanguageComponent
 */


/**@type {LanguageComponent} */
const TEXT = {
    JA: {
        LOADING: "読み込み中...",
        LOADING_MAP: "マップを読み込んでいます...",
        MAP_LOADED: "ようこそ",
        MAP_LOAD_RETRYING: "エラーが発生ました<br>{0}秒後に再挑戦します...",
        PROCESSING: "処理中...",
        NOTIFICATION_COPIED_LINK: "リンクをコピーしました！",
        NOTIFICATION_SHARED_EVENT_FOUND: "シェアされたイベントを表示しています",
        NOTIFICATION_SHARED_EVENT_NOT_FOUND: "シェアされたイベントが見つかりませんでした",
        NOTIFICATION_SHARED_EVENT_TRANSITIONED: "指定された位置を表示しています",
        NOTIFICATION_CONNECTION_ERROR: "通信エラーが発生しました",
        NOTIFICATION_ERROR_ANY: "エラーが発生しました。",
        NOTIFICATION_CHECK_YOUR_CONNECTION: "通信状況をご確認ください",
        SHARE_EVENT_MESSAGE: "世田谷学園 獅子児祭のイベント:",
        SHARE_EVENT_POPUP_TITLE: "イベント記事をシェア",
        SHARE_EVENT_POPUP_SUBTITLE: "共有されたリンクを開くと、マップがこのイベントをフォーカスしこの記事が開かれます",
        SHARE_EVENT_DATA_TITLE: "獅子児祭",
        SHARE_EVENT_INCLUDE_EVTH: "現在の位置に指定",
        ARTICLE_NO_ARTICLE: "このイベントに関する記載はありません",
        ARTICLE_CORE_GRADE: "中心学年",
        ARTICLE_CONNECTION_ERROR: "通信エラーが発生しました。<br>ネットワーク状況をご確認の上、再度お試しください。",
        ARIA_ARTICLE_HEADER: "ヘッダー画像",
        ARIA_ARTICLE_ICON: "アイコン画像",
        ERROR_ANY: "エラーが発生しました。<br>再度お試しください。",
    },
    EN: {
        LOADING: "Loading...",
        LOADING_MAP: "Loading map...",
        MAP_LOADED: "Welcome",
        MAP_LOAD_RETRYING: "Error occured.<br>Retrying in {0} seconds...",
        PROCESSING: "Processing...",
        NOTIFICATION_COPIED_LINK: "Link Copied!",
        NOTIFICATION_SHARED_EVENT_FOUND: "Displaying the shared event article.",
        NOTIFICATION_SHARED_EVENT_NOT_FOUND: "Sorry, we couldn't find the shared event.",
        NOTIFICATION_SHARED_EVENT_TRANSITIONED: "Showing designated location.",
        NOTIFICATION_CONNECTION_ERROR: "Connection Error",
        NOTIFICATION_ERROR_ANY: "An Error occured.",
        NOTIFICATION_CHECK_YOUR_CONNECTION: "Please check your network connection.",
        SHARE_EVENT_MESSAGE: "Shishiji Festival, Setagayagakuen; ",
        SHARE_EVENT_POPUP_TITLE: "Share Event Article",
        SHARE_EVENT_POPUP_SUBTITLE: "The map focuses on this event and opens this article, when openning a shared link",
        SHARE_EVENT_DATA_TITLE: "Shishiji festival",
        SHARE_EVENT_INCLUDE_EVTH: "Show current article location",
        ARTICLE_NO_ARTICLE: "No information available for this event.",
        ARTICLE_CORE_GRADE: "Core Grade",
        ARTICLE_CONNECTION_ERROR: "Connection Error occured.<br>Please check your network status and try again.",
        ARIA_ARTICLE_HEADER: "header image",
        ARIA_ARTICLE_ICON: "icon image",
        ERROR_ANY: "An error occured.<br>Please try again.",
    },
};
