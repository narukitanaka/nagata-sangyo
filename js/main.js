///////////////////////////////////////////
//Swiper aboutーswiper
//////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  // テキストデータの配列
  const slideTexts = [
    {
      service: "Service 01",
      title: "小麦でん粉・小麦たん白の<br>製造・販売",
      description:
        "70年以上にわたり培った技術と品質で、高品質な小麦由来原料を安定供給しています。",
    },
    {
      service: "Service 02",
      title: "食品の委受託加工",
      description:
        "お客様のニーズに合わせた食品の委受託加工サービスを提供しています。",
    },
    {
      service: "Service 03",
      title: "新規事業",
      description:
        "小麦の新たな可能性を追求し、革新的な事業展開を進めています。",
    },
  ];
  const aboutSwiper = new Swiper(".about-swiper", {
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    on: {
      slideChange: function () {
        const activeIndex = this.realIndex;

        // リストのアクティブ状態を更新
        const listItems = document.querySelectorAll(".swiper-list li");
        listItems.forEach((item, index) => {
          item.classList.toggle("active", index === activeIndex);
        });

        // テキストコンテンツを更新
        const textContainer = document.querySelector(".swiper-text");
        const serviceEl = textContainer.querySelector(".en");
        const titleEl = textContainer.querySelector("h3");
        const descEl = textContainer.querySelector("p");

        serviceEl.textContent = slideTexts[activeIndex].service;
        titleEl.innerHTML = slideTexts[activeIndex].title;
        descEl.textContent = slideTexts[activeIndex].description;
      },
    },
  });

  // リストアイテムクリック時の処理
  const listItems = document.querySelectorAll(".swiper-list li");
  listItems.forEach((item, index) => {
    item.addEventListener("click", function () {
      aboutSwiper.slideToLoop(index);
    });
  });
});

///////////////////////////////////////////
//ハンバーガーメニュー
//////////////////////////////////////////
// $(".hambager").on("click", function () {
//   navOpen();
// });
// let navFlg = false;
// function navOpen() {
//   if (!navFlg) {
//     $(".hamberger-wrap").addClass("is-ham-open");
//     $(".drawer-menu").addClass("is-drawermenu-open");
//     $("header").addClass("is-drawermenu-header");
//     navFlg = true;
//   } else {
//     $(".hamberger-wrap").removeClass("is-ham-open");
//     $(".drawer-menu").removeClass("is-drawermenu-open");
//     $("header").removeClass("is-drawermenu-header");
//     navFlg = false;
//   }
// }

///////////////////////////////////////////
//ドロワーメニュー インスタ アコーディオン
///////////////////////////////////////////
$(".accordion-content").hide();
$(".insta_accordion-trigger").on("click", function (e) {
  e.preventDefault(); // a要素に変える場合の保険
  const $btn = $(this);
  const $panel = $btn.next(".accordion-content"); // 兄弟を取得
  $btn.toggleClass("open");
  $panel.stop(true, true).slideToggle("fast");
});

////////////////////////////////////////////////////////////////////////////////////////
// GSAP アニメーション
///////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////
//フェードイン
//////////////////////////////////////////////////////
const textElements = document.querySelectorAll(".fadeIn");
if (textElements.length > 0) {
  textElements.forEach((element) => {
    gsap.from(element, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element, // 各要素をトリガーに
        start: "top 60%",
        once: true,
      },
    });
  });
}

//////////////////////////////////////////////////////
//順番にフェードイン
//////////////////////////////////////////////////////
const orderFadeInSections = document.querySelectorAll(".order-fadeIn");
if (orderFadeInSections.length > 0) {
  orderFadeInSections.forEach((section) => {
    const fadeChildElements = section.querySelectorAll(".fadeChild");
    if (fadeChildElements.length > 0) {
      gsap.from(fadeChildElements, {
        opacity: 0,
        y: 20,
        duration: 1.2,
        ease: "power2.out",
        stagger: 0.6, // 0.3秒ずつ遅延
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          once: true,
        },
      });
    }
  });
}

//////////////////////////////////////////////////////
//scale0から１に拡大しながらにフェードイン
//////////////////////////////////////////////////////
const scaleFadeInElements = document.querySelectorAll(".scale-fadeIn");
if (scaleFadeInElements.length > 0) {
  scaleFadeInElements.forEach((element) => {
    gsap.from(element, {
      opacity: 0,
      scale: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: element,
        start: "top 60%",
        once: true,
      },
    });
  });
}

//////////////////////////////////////////////////////
//さりげないパララックス
//////////////////////////////////////////////////////
const parallaxElements = document.querySelectorAll(".parallax");
if (parallaxElements.length > 0) {
  parallaxElements.forEach((element) => {
    let yValue = 150;
    element.classList.forEach((cls) => {
      if (/^y-?\d+$/.test(cls)) {
        yValue = parseInt(cls.replace("y", ""), 10);
      }
    });

    // スマホかつ.sp-para-noneクラスがある場合はパララックス無効
    if (
      window.innerWidth <= 750 &&
      element.classList.contains("sp-para-none")
    ) {
      return; // パララックス処理をスキップ
    }

    gsap.fromTo(
      element,
      { y: yValue },
      {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });
}

//////////////////////////////////////////////////////
//さりげないパララックス（背景画像）
//////////////////////////////////////////////////////
const parallaxBgElements = document.querySelectorAll(".parallax-bg");
if (parallaxBgElements.length > 0) {
  parallaxBgElements.forEach((element) => {
    let yValue = 20;
    element.classList.forEach((cls) => {
      if (/^y-?\d+$/.test(cls)) {
        yValue = parseInt(cls.replace("y", ""), 10);
      }
    });
    gsap.fromTo(
      element,
      { backgroundPosition: `center ${50 + yValue}%` },
      {
        backgroundPosition: `center ${50 - yValue}%`,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });
}
