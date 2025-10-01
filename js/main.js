///////////////////////////////////////////
//header .fv-pointを過ぎると.fixedクラスを付与
//////////////////////////////////////////
$(function () {
  const $window = $(window);
  const $header = $("header");
  const $fvPoint = $(".fv-point");

  if ($fvPoint.length === 0) {
    return; // 監視対象がない場合は何もしない
  }

  let fvPointBottom = 0;
  let isFixed = false;
  let removeFixedTimer = null;

  const activateFixed = () => {
    if (isFixed) {
      return;
    }
    isFixed = true;
    if (removeFixedTimer) {
      clearTimeout(removeFixedTimer);
      removeFixedTimer = null;
    }

    $header.addClass("fixed");
    requestAnimationFrame(() => {
      if (isFixed) {
        $header.addClass("fixed-enter");
      }
    });
  };

  const deactivateFixed = () => {
    if (!isFixed) {
      return;
    }
    isFixed = false;
    $header.removeClass("fixed-enter");

    removeFixedTimer = window.setTimeout(() => {
      if (!isFixed) {
        $header.removeClass("fixed");
      }
      removeFixedTimer = null;
    }, 400);
  };

  const updateHeaderState = () => {
    const scrollTop = $window.scrollTop();
    if (scrollTop >= fvPointBottom) {
      activateFixed();
    } else {
      deactivateFixed();
    }
  };

  const recalcBottom = () => {
    const offset = $fvPoint.offset();
    if (!offset) {
      fvPointBottom = 0;
      return;
    }
    fvPointBottom = offset.top + $fvPoint.outerHeight(true);
  };

  $window.on("scroll", updateHeaderState);
  $window.on("resize", () => {
    recalcBottom();
    updateHeaderState();
  });
  $window.on("load", () => {
    recalcBottom();
    updateHeaderState();
  });

  recalcBottom();
  updateHeaderState();
});

///////////////////////////////////////////
//Swiper topーfv
//////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  const swiper = new Swiper(".fv-slider", {
    loop: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true,
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    speed: 1500,
    on: {
      init: function () {
        updatePagination(this.realIndex);
        startProgressAnimation(this.realIndex);
      },
      slideChange: function () {
        updatePagination(this.realIndex);
        startProgressAnimation(this.realIndex);
      },
    },
  });

  function updatePagination(activeIndex) {
    const dots = document.querySelectorAll(".pagination-dot");

    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle("active", isActive);

      if (!isActive) {
        const progressRing = dot.querySelector(".progress-ring");
        progressRing.style.strokeDashoffset = "119.38";
      }
    });
  }

  function startProgressAnimation(activeIndex) {
    const activeDot = document.querySelector(
      `.pagination-dot[data-index="${activeIndex}"]`
    );
    if (activeDot) {
      const progressRing = activeDot.querySelector(".progress-ring");
      progressRing.style.strokeDashoffset = "119.38";

      setTimeout(() => {
        progressRing.style.transition = "stroke-dashoffset 3s linear";
        progressRing.style.strokeDashoffset = "0";
      }, 100);
    }
  }

  // ドットクリックでスライド切り替え
  document.querySelectorAll(".pagination-dot").forEach((dot, index) => {
    dot.addEventListener("click", () => {
      swiper.slideToLoop(index);
    });
  });
});

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

  const listItems = Array.from(document.querySelectorAll(".swiper-list li"));
  const listWrapper = document.querySelector(".swiper-list ul");
  const textContainer = document.querySelector(".swiper-text");
  const serviceEl = textContainer ? textContainer.querySelector(".en") : null;
  const titleEl = textContainer ? textContainer.querySelector("h3") : null;
  const descEl = textContainer ? textContainer.querySelector("p") : null;
  const canUseGsap = typeof gsap !== "undefined";

  const setTextContent = (activeIndex) => {
    if (!textContainer || !serviceEl || !titleEl || !descEl) {
      return;
    }
    const content = slideTexts[activeIndex];
    if (!content) {
      return;
    }
    serviceEl.textContent = content.service;
    titleEl.innerHTML = content.title;
    descEl.textContent = content.description;
  };

  const animateTextChange = (activeIndex) => {
    if (!textContainer) {
      setTextContent(activeIndex);
      return;
    }

    if (!canUseGsap) {
      setTextContent(activeIndex);
      textContainer.style.opacity = "1";
      textContainer.style.transform = "translateY(0)";
      return;
    }

    gsap.killTweensOf(textContainer);
    gsap
      .timeline()
      .to(textContainer, {
        autoAlpha: 0,
        y: 20,
        duration: 0.2,
        ease: "power2.in",
      })
      .add(() => {
        setTextContent(activeIndex);
      })
      .fromTo(
        textContainer,
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
          immediateRender: false,
        }
      );
  };

  const updateActiveList = (activeIndex) => {
    listItems.forEach((item, index) => {
      item.classList.toggle("active", index === activeIndex);
    });
  };

  const getIndicatorSize = () => {
    if (!listWrapper) {
      return 0;
    }
    const pseudoStyle = window.getComputedStyle(listWrapper, "::after");
    const height = parseFloat(pseudoStyle.height);
    return Number.isNaN(height) ? 0 : height;
  };

  const moveIndicator = (activeIndex, animate = true) => {
    if (!listWrapper || !listItems[activeIndex]) {
      return;
    }

    const target = listItems[activeIndex];
    const indicatorSize = getIndicatorSize();
    const translateY =
      target.offsetTop + target.offsetHeight / 2 - indicatorSize / 2;
    const offsetValue = `${translateY}px`;

    if (canUseGsap) {
      if (animate) {
        gsap.to(listWrapper, {
          "--indicator-offset": offsetValue,
          duration: 0.22,
          ease: "power2.out",
        });
      } else {
        gsap.set(listWrapper, { "--indicator-offset": offsetValue });
      }
    } else {
      if (!animate) {
        listWrapper.classList.remove("indicator-ready");
        listWrapper.style.setProperty("--indicator-offset", offsetValue);
        requestAnimationFrame(() => {
          listWrapper.classList.add("indicator-ready");
        });
      } else {
        listWrapper.style.setProperty("--indicator-offset", offsetValue);
      }
    }
  };

  const getSlidesArray = (swiper) => {
    if (!swiper || !swiper.slides) {
      return [];
    }
    return Array.from(swiper.slides);
  };

  const alignSlideOpacity = (swiper) => {
    const slides = getSlidesArray(swiper);
    if (slides.length === 0) {
      return;
    }

    slides.forEach((slide, index) => {
      const isActive = index === swiper.activeIndex;
      if (canUseGsap) {
        gsap.set(slide, { opacity: isActive ? 1 : 0 });
      } else {
        slide.style.opacity = isActive ? "1" : "0";
      }
    });
  };

  const animateSlideTransition = (swiper) => {
    if (!swiper) {
      return;
    }

    if (!canUseGsap) {
      alignSlideOpacity(swiper);
      return;
    }

    const slides = getSlidesArray(swiper);
    if (slides.length === 0) {
      return;
    }

    const activeIndex = swiper.activeIndex;
    const previousIndex =
      typeof swiper.previousIndex === "number" ? swiper.previousIndex : null;

    slides.forEach((slide, index) => {
      if (index !== activeIndex && index !== previousIndex) {
        gsap.set(slide, { opacity: 0 });
      }
    });

    const activeSlide = slides[activeIndex];
    const previousSlide = previousIndex !== null ? slides[previousIndex] : null;

    if (previousSlide && previousSlide !== activeSlide) {
      gsap.killTweensOf(previousSlide);
      gsap.to(previousSlide, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.inOut",
        overwrite: true,
      });
    }

    if (activeSlide) {
      gsap.killTweensOf(activeSlide);
      gsap.fromTo(
        activeSlide,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.45,
          ease: "power2.out",
          overwrite: true,
        }
      );
    }
  };

  const aboutSwiper = new Swiper(".about-swiper", {
    loop: true,
    spaceBetween: 100,
    speed: 600,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    on: {
      init: function () {
        const activeIndex = this.realIndex;
        updateActiveList(activeIndex);
        setTextContent(activeIndex);
        moveIndicator(activeIndex, false);
        alignSlideOpacity(this);
        if (listWrapper) {
          requestAnimationFrame(() => {
            listWrapper.classList.add("indicator-ready");
          });
        }
      },
      slideChangeTransitionStart: function () {
        animateSlideTransition(this);
      },
      slideChangeTransitionEnd: function () {
        alignSlideOpacity(this);
      },
      slideChange: function () {
        const activeIndex = this.realIndex;
        updateActiveList(activeIndex);
        animateTextChange(activeIndex);
        moveIndicator(activeIndex, true);
      },
    },
  });

  if (listWrapper && listItems.length > 0) {
    window.addEventListener("resize", () => {
      moveIndicator(aboutSwiper.realIndex, false);
      alignSlideOpacity(aboutSwiper);
    });
  }

  listItems.forEach((item, index) => {
    item.addEventListener("click", function () {
      aboutSwiper.slideToLoop(index);
    });
  });
});

///////////////////////////////////////////
//sp-menuボタン
///////////////////////////////////////////
$(function () {
  const $drawerMenu = $(".drawer-menu");
  const $spMenu = $(".sp-menu");
  const $spMenuButton = $(".sp-menu button");
  const $buttonText = $spMenuButton.find("p.en");
  const $header = $("header");

  $spMenuButton.on("click", function () {
    const isOpen = $drawerMenu.hasClass("is-open");
    if (isOpen) {
      $drawerMenu.removeClass("is-open");
      $spMenu.removeClass("is-open");
      $header.removeClass("is-open");
      $buttonText.text("menu");
      $("body").css("overflow", "auto"); // スクロールを元に戻す
    } else {
      $drawerMenu.addClass("is-open");
      $spMenu.addClass("is-open");
      $header.addClass("is-open");
      $buttonText.text("close");
      $("body").css("overflow", "hidden"); // 背景のスクロールを無効化
    }
  });

  // ドロワーメニュー内のリンクをクリックしたときにメニューを閉じる
  $drawerMenu.find("a").on("click", function () {
    if ($drawerMenu.hasClass("is-open")) {
      $drawerMenu.removeClass("is-open");
      $spMenu.removeClass("is-open");
      $header.removeClass("is-open");
      $buttonText.text("menu");
      $("body").css("overflow", "auto"); // スクロールを元に戻す
    }
  });
});

///////////////////////////////////////////
//ドロワーメニュー アコーディオン
///////////////////////////////////////////
$(".drawer-menu .child").hide();
$(".drawer-menu .parent .plus").on("click", function (e) {
  e.preventDefault();
  const $btn = $(this);
  const $parent = $btn.closest(".parent");
  const $panel = $parent.find(".child");
  $parent.toggleClass("accordion-open");
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
// const scaleFadeInElements = document.querySelectorAll(".scale-fadeIn");
// if (scaleFadeInElements.length > 0) {
//   scaleFadeInElements.forEach((element) => {
//     gsap.from(element, {
//       opacity: 0,
//       scale: 0,
//       duration: 0.8,
//       ease: "back.out(1.7)",
//       scrollTrigger: {
//         trigger: element,
//         start: "top 60%",
//         once: true,
//       },
//     });
//   });
// }

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

    // PCかつ.pc-para-noneクラスがある場合はパララックス無効
    if (window.innerWidth > 750 && element.classList.contains("pc-para-none")) {
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

//////////////////////////////////////////////////////
//ファーストビューアニメーション
//////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined") {
    return;
  }
  const fv01 = document.querySelector(".fvanime01");
  if (!fv01) {
    return;
  }
  const fv02 = document.querySelector(".fvanime02");
  const fv03 = document.querySelector(".fvanime03");
  const fv04 = document.querySelector(".fvanime04");
  const fv05 = document.querySelector(".fvanime05");
  const fv06 = document.querySelector(".fvanime06");
  const fv07 = document.querySelector(".fvanime07");
  const header = document.querySelector("header");

  const fvAll = [fv01, fv02, fv03, fv04, fv05, fv06, fv07].filter(Boolean);
  gsap.set(fvAll, { opacity: 0, y: 30 });

  // fv04とfv06は位置を変えずにフェードインのみ
  if (fv04) {
    gsap.set(fv04, { opacity: 0 });
  }
  if (fv06) {
    gsap.set(fv06, { opacity: 0 });
  }

  if (header) {
    header.classList.add("is-animating");
    gsap.set(header, { opacity: 0 });
  }

  const tl = gsap.timeline({ defaults: { duration: 0.8, ease: "power3.out" } });

  tl.to(fv01, { opacity: 1, y: 0 });

  if (fv04) {
    tl.to(fv04, { opacity: 1, duration: 1.2, ease: "sine.in" }, "+=0.1");
  }

  if (fv06) {
    tl.to(fv06, { opacity: 1, duration: 0.6, ease: "sine.in" }, "-=0.6");
  }

  const groupThree = [fv02, fv03, fv05, fv07].filter(Boolean);
  if (groupThree.length) {
    tl.to(groupThree, { opacity: 1, y: 0 }, "+=0.1");
    if (header) {
      tl.fromTo(
        header,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, clearProps: "transform,opacity" },
        "<"
      );
    }
  } else if (header) {
    tl.fromTo(
      header,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, clearProps: "transform,opacity" },
      "+=0.1"
    );
  }

  if (header) {
    tl.call(function () {
      header.classList.remove("is-animating");
    });
  }
});
