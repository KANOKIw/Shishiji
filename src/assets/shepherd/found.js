//@ts-check
"use strict";


/**
 * @typedef {import("shepherd.js").Tour} ShepherdTour
 * @typedef {import("shepherd.js").StepOptions} ShepherdStepOptions
 */


/**@type {{[key: string]: ShepherdTour}} */
const Shepherd_Tours = {
    main_screen: new Shepherd.Tour({
        defaultStepOptions: {
            classes: "shepherd-theme-arrows",
            scrollTo: false
        }
    }),
    menu: new Shepherd.Tour({
        defaultStepOptions: {
            classes: "shepherd-theme-arrows",
            scrollTo: false
        }
    }),
    ranking: new Shepherd.Tour({
        defaultStepOptions: {
            classes: "shepherd-theme-arrows",
            scrollTo: false
        }
    }),
    article: new Shepherd.Tour({
        defaultStepOptions: {
            classes: "shepherd-theme-arrows",
            scrollTo: false
        }
    }),
};


/**@type {{[key: string]: ShepherdStepOptions[]}} */
const Shepherd_Tour_Steps = {
    main_screen: [
        {
            title: "階切り替え",
            text: "閲覧する階を変更できます",
            attachTo: {
                element: "#fsel-xxl",
                on: "left"
            },
            buttons: [
                {
                    text: "次へ",
                    action: Shepherd_Tours.main_screen.next
                }
            ]
        },
        {
            title: "団体",
            text: "タップするとこの場所にある団体の情報を確認できます",
            attachTo: {
                element: "#disc-swimming",
                on: "right"
            },
            buttons: [
                {
                    text: "戻る",
                    action: Shepherd_Tours.main_screen.back
                },
                {
                    text: "次へ",
                    action: Shepherd_Tours.main_screen.next
                }
            ]
        },
        {
            title: "プロフィール",
            text: "ランキングに載るプロフィールを変更できます(アイコン, ニックネーム)",
            attachTo: {
                element: "#user-profile-opner",
                on: "top-end"
            },
            buttons: [
                {
                    text: "戻る",
                    action: Shepherd_Tours.main_screen.back
                },
                {
                    text: "次へ",
                    action: Shepherd_Tours.main_screen.next
                }
            ]
        },
        {
            title: "メニュー",
            text: "タップするとほかのさまざまな機能をご利用いただけます",
            attachTo: {
                element: "#pkgo_mainb",
                on: "top"
            },
            buttons: [
                {
                    text: "戻る",
                    action: Shepherd_Tours.main_screen.back
                },
                {
                    text: "了解",
                    action: () => {
                        tour_status.main_screen = MOVEPROPERTY.deny = false;
                        Shepherd_Tours.main_screen.next();
                    }
                }
            ]
        }
    ],
    menu: [
        {
            title: "QRコード",
            text: "入場記録, スタンプラリーに使用し、ポイントを獲得できます",
            attachTo: {
                element: "#qrcodebuttonman",
                on: "top"
            },
            buttons: [
                {
                    text: "次へ",
                    action: Shepherd_Tours.menu.next
                }
            ]
        },
        {
            title: "ミッション",
            text: "ミッションを達成するとポイントをもらえます(団体に入室された時にもらえるポイントと同じです)。\nポイントが貯まるトランクが上がって、チケットを獲得できます",
            attachTo: {
                element: "#pkgo_menu1 > div",
                on: "top"
            },
            buttons: [
                {
                    text: "戻る",
                    action: Shepherd_Tours.menu.back
                },
                {
                    text: "次へ",
                    action: Shepherd_Tours.menu.next
                }
            ]
        },
        {
            title: "チケット",
            text: "ミッションで獲得したチケットで景品交換ができます",
            attachTo: {
                element: "#ticketsbuttonman",
                on: "top"
            },
            buttons: [
                {
                    text: "戻る",
                    action: Shepherd_Tours.menu.back
                },
                {
                    text: "次へ",
                    action: Shepherd_Tours.menu.next
                }
            ]
        },
        {
            title: "イベント",
            text: "バンドやダンスなどのイベントスケジュールをご確認いただけます",
            attachTo: {
                element: "#pkgo_menu3 > div",
                on: "top"
            },
            buttons: [
                {
                    text: "戻る",
                    action: Shepherd_Tours.menu.back
                },
                {
                    text: "次へ",
                    action: Shepherd_Tours.menu.next
                }
            ]
        },
        {
            title: "展示団体",
            text: "マップに表示されているアイコンの一覧や検索ができます",
            attachTo: {
                element: "#pkgo_menu5 > div",
                on: "top"
            },
            buttons: [
                {
                    text: "戻る",
                    action: Shepherd_Tours.menu.back
                },
                {
                    text: "次へ",
                    action: Shepherd_Tours.menu.next
                }
            ]
        },
        {
            title: "人気投票",
            text: "イベントや、訪れた団体に人気投票することができます",
            attachTo: {
                element: "#pkgo_menu2 > div",
                on: "top"
            },
            buttons: [
                {
                    text: "戻る",
                    action: Shepherd_Tours.menu.back
                },
                {
                    text: "次へ",
                    action: Shepherd_Tours.menu.next
                }
            ]
        },
        {
            title: "グッズ紹介",
            text: "獅子児祭グッズを紹介します",
            attachTo: {
                element: "#pkgo_menu4 > div",
                on: "top"
            },
            buttons: [
                {
                    text: "戻る",
                    action: Shepherd_Tours.menu.back
                },
                {
                    text: "次へ",
                    action: Shepherd_Tours.menu.next
                }
            ]
        },
        {
            title: "飲食",
            text: "獅子児祭での飲食店の一覧をご覧いただけます",
            attachTo: {
                element: "#pkgo_menu7 > div",
                on: "bottom"
            },
            buttons: [
                {
                    text: "戻る",
                    action: Shepherd_Tours.menu.back
                },
                {
                    text: "終わる",
                    action: () => {
                        Shepherd_Tours.menu.next();
                        tour_status.pkgo = false;
                    }
                }
            ]
        }
    ],
    ranking: [
        {
            title: "ランキング",
            text: "ミッションptの上位100人が表示されます（それだけです）",
            attachTo: {
                element: "#go_to_ranking",
                on: "left-start"
            },
            buttons: [
                {
                    text: "終わる",
                    action: () => {
                        Shepherd_Tours.ranking.next();
                        tour_status.pkgo = false;
                    }
                }
            ]
        }
    ],
    article: [
        {
            title: "お気に入り",
            text: "登録されるとそのアイコンの左下に印が付きます。投票などでの絞り込みにもご活用いただけます",
            attachTo: {
                element: "#dvd2",
                on: "bottom"
            },
            buttons: [
                {
                    text: "次へ",
                    action: Shepherd_Tours.article.next
                }
            ]
        },
        {
            title: "投票",
            text: "訪れた（入場記録をとった）団体には人気投票ができます",
            attachTo: {
                element: "#dvd3",
                on: "bottom"
            },
            buttons: [
                {
                    text: "戻る",
                    action: Shepherd_Tours.article.back
                },
                {
                    text: "次へ",
                    action: Shepherd_Tours.article.next
                }
            ]
        },
        {
            title: "詳細",
            text: "団体の詳細情報",
            attachTo: {
                element: "#ovv-t-details-sd",
                on: "bottom"
            },
            buttons: [
                {
                    text: "戻る",
                    action: Shepherd_Tours.article.back
                },
                {
                    text: "次へ",
                    action: () => {
                        $("#ovv-t-details-sd").trigger("click");
                        setTimeout(Shepherd_Tours.article.next, 50);
                    }
                }
            ]
        },
        {
            title: "訪問pt",
            text: "入場記録をとった際に<br>獲得できるミッションptです<br>混雑状況によって変化します",
            attachTo: {
                element: ".ev_property",
                on: "bottom"
            },
            buttons: [
                {
                    text: "戻る",
                    action: () => {
                        $("#ovv-t-description-sd").trigger("click");
                        setTimeout(Shepherd_Tours.article.back, 50);
                    }
                },
                {
                    text: "終わる",
                    action: () => {
                        Shepherd_Tours.article.next();
                        tour_status.article = false;
                    }
                }
            ]
        }
    ]
};


+function(){
    for (const [tourname, steps] of Object.entries(Shepherd_Tour_Steps)){
        const tour = Shepherd_Tours[tourname];
        steps.forEach(step => tour.addStep(step));
    }
}();
