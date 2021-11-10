(function () {
  const throttle = function (type, name, obj) {
    obj = obj || window;

    let running = false;

    const func = function () {
      if (running) {
        return;
      }

      running = true;

      requestAnimationFrame(() => {
        obj.dispatchEvent(new CustomEvent(name));

        running = false;
      });
    };

    obj.addEventListener(type, func);
  };

  throttle("resize", "optimizedResize");
})();

(function (obj) {
  obj = obj || window;

  const animation = function (elem, prop, cb) {
    const count = prop.count;

    let counter = 0;

    if (prop.start) {
      prop.start.forEach((item) => {
        elem.style[item[0]] = item[1];
      });
    }

    const allAnimation = [];

    prop.anim.forEach(([style, from, to]) => {
      const max = Math.max(from, to);

      const min = Math.min(from, to);

      const step = (max - min) / count;

      console.log(min === to);

      allAnimation.push({ style, from, to, step, reverse: min === to });
    });

    const rafAnimation = function () {
      allAnimation.forEach((item) => {
        if (item.reverse) {
          item.from -= item.step;
        } else {
          item.from += item.step;
        }

        elem.style[item.style] = item.from;
      });

      counter++;

      if (counter < count) {
        requestAnimationFrame(rafAnimation);
      } else {
        if (prop.end) {
          prop.end.forEach((item) => {
            elem.style[item[0]] = item[1];
          });
        }

        if (cb) cb();
      }
    };

    requestAnimationFrame(rafAnimation);
  };

  obj.animation = animation;
})();

function init() {
  document.head.insertAdjacentHTML(
    "beforeend",

    `<link type="text/css" rel="stylesheet" href="youtube-modal/index.css">`
  );

  const overlay = document.createElement("div");

  overlay.className = "youtube-modal-overlay";

  document.body.insertAdjacentElement("beforeend", overlay);

  const video = document.createElement("div");

  video.id = "youtube-modal-container";

  const sizeBlockList = [
    [3840, 2160],

    [2560, 1440],

    [1920, 1080],

    [1280, 720],

    [854, 420],

    [640, 360],

    [426, 240],
  ];

  function sizeVideo() {
    const sizeBlock =
      sizeBlockList.find((item) => item[0] < window.visualViewport.width) ||
      sizeBlockList[sizeBlockList.length - 1];

    const iframe = document.getElementById("youtube-modal");

    iframe.width = sizeBlock[0];

    iframe.height = sizeBlock[1];

    video.style.cssText = `

			width: ${sizeBlock[0]};

			height: ${sizeBlock[1]};

		`;
  }

  function sizeContainer() {
    const wh = window.visualViewport.height;

    const ww = window.visualViewport.width;

    const fw = video.style.width;

    const fh = video.style.height;

    video.style.left = (ww - fw) / 2;

    video.style.top = (wh - fh) / 2;

    overlay.style.height = document.documentElement.clientHeight;
  }

  const sizeYoutubeModal = () => {
    sizeContainer();

    sizeVideo();
  };

  function closeYoutubeModal() {
    animation(
      overlay,
      {
        end: [["display", "none"]],

        anim: [["opacity", 1, 0]],

        count: 20,
      },

      () => {
        overlay.textContent = "";
      }
    );

    window.removeEventListener("optimizedResize", sizeYoutubeModal);

    document.removeEventListener("keyup", closeContainerEsc);
  }

  const closeContainerEsc = (e) => {
    if (e.keyCode === 27) {
      closeYoutubeModal();
    }
  };

  const openYoutubeModal = (e) => {
    const target = e.target.closest(".youtube-modal");

    if (!target) return;

    const href = target.href;

    const search = href.includes("youtube");

    const idVideo = search
      ? href.match(/(\?|&)v=([^&]+)/)[2]
      : href.match(/(\.be\/)([^&]+)/)[2];

    if (idVideo.length === 0) return;

    e.preventDefault();

    animation(overlay, {
      start: [["display", "block"]],

      anim: [["opacity", 0, 1]],

      count: 20,
    });

    overlay.insertAdjacentHTML(
      "beforeend",
      `

			<div id="youtube-modal-loading">Loading...</div>

			<div id="youtube-modal-close">&#10006;</div>

			<div id="youtube-modal-container">

				<iframe src="http://youtube.com/embed/${idVideo}" 

					frameborder=0

					id="youtube-modal" 

					allowfullscreen="">

				</iframe>

			</div>

		`
    );

    sizeVideo();

    sizeContainer();

    window.addEventListener("optimizedResize", sizeYoutubeModal);

    document.addEventListener("keyup", closeContainerEsc);
  };

  overlay.addEventListener("click", closeYoutubeModal);

  document.addEventListener("click", openYoutubeModal);
}

document.addEventListener("DOMContentLoaded", init);
