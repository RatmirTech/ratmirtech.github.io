/* eslint-disable max-len */

const getElement = (tagName, classNames, attributes) => {
    const element = document.createElement(tagName);
    if (classNames) {
        element.classList.add(...classNames);
    }
    if (attributes) {
        for (const attr in attributes) {
            element[attr] = attributes[attr];
        }
    }

    return element;
};

const createHeader = ({ title, header: { logo, social, menu } }) => {
    const header = getElement("header");
    const container = getElement("div", ["container"]);
    const wrapper = getElement("div", ["header"]);
    const burger = getElement("button", ["menu-button"]);

    document.addEventListener("click", e => {
        let target = e.target;
        if (target.matches(".menu-button")) {
            burger.classList.toggle("menu-button-active");
            wrapper.classList.toggle("header-active");
        } else {
            target = target.closest(".header-active");
            if (!target) {
                burger.classList.remove("menu-button-active");
                wrapper.classList.remove("header-active");
            }
        }
    });

    if (logo) {
        const logotype = getElement("img", ["logo"], {
            src: logo,
            alt: "Логотип " + title,
        });
        wrapper.append(logotype);
    }

    if (menu) {
        const menuWrapper = getElement("nav", ["menu-list"], null);
        const menuItems = menu.map(item => {
            const menuItem = getElement("a", ["menu-link"], {
                href: item.link,
                textContent: item.title,
                target: "blank",
            });
            // menuItem.textContent = item.title;

            return menuItem;
        });
        menuWrapper.append(...menuItems);
        wrapper.append(menuWrapper);
    }

    if (social) {
        const socialWrapper = getElement("div", ["social"]);
        const allSocial = social.map(item => {
            const socialLink = getElement("a", ["social-link"]);
            socialLink.append(
                getElement("img", [], {
                    src: item.image,
                    alt: item.title,
                })
            );

            socialLink.href = item.link;

            return socialLink;
        });
        socialWrapper.append(...allSocial);
        wrapper.append(socialWrapper);
    }

    header.append(container);
    container.append(wrapper, burger);

    return header;
};

const createMain = ({ title, main: { genre, rating, description, trailer, episodes }, }) => {
    // const {title, main: {genre, rating, description, trailer}} = params; //аналог записи в скобках выше - destruction
    const main = getElement("main");
    const container = getElement("div", ["container"]);
    main.append(container);
    const wrapper = getElement("div", ["main-content"]);
    container.append(wrapper);
    const content = getElement("div", ["content"]);
    wrapper.append(content);

    if (genre) {
        const genreSpan = getElement("span", ["genre", "animated", "fadeInRight"], {
            textContent: genre,
        });
        content.append(genreSpan);
    }
    if (rating) {
        const ratingBlock = getElement("div", [
            "rating",
            "animated",
            "fadeInRight",
        ]);
        const ratingStars = getElement("div", ["rating-stars"]);
        const ratingNumber = getElement("div", ["rating-number"], {
            textContent: `${rating}/10`,
        });

        for (let i = 0; i < 10; i++) {
            const star = getElement("img", ["star"], {
                alt: i ? "" : `Рейтинг ${rating} из 10`,
                src: i < rating ? "./img/star.svg" : "./img/star-o.svg",
            });
            ratingStars.append(star);
        }

        content.append(ratingBlock);
        ratingBlock.append(ratingStars, ratingNumber);
    }

    content.append(
        getElement("h1", ["main-title", "animated", "fadeInRight"], {
            textContent: title,
        })
    );

    if (description) {
        content.append(
            getElement("p", ["main-description", "animated", "fadeInRight"], {
                textContent: description,
            })
        );
    }

    if (trailer) {
        const youtubeLink = getElement(
            "a",
            ["button", "animated", "fadeInRight", "youtube-modal"],
            { href: trailer, textContent: "Смотреть трейлер" }
        );
        const youtubeImgLink = getElement("a", ["play", "youtube-modal"], {
            href: trailer,
            ariaLabel: "Смотреть трейлер",
        });
        const playIcon = getElement("img", ["play-img"], {
            src: "./img/play.svg",
            alt: "",
            ariaHidden: true,
        });

        content.append(youtubeLink);
        youtubeImgLink.append(playIcon);
        wrapper.append(youtubeImgLink);
    }

    if (episodes) {
        const episodesContainer = getElement('div', ['series']);
        const swiperContainer = getElement('div', ['swiper-container']);
        const swiperWrapper = getElement('div', ['swiper-wrapper']);

        // Два варианта реализации слайдов:

        // const renderSlide = slide => {
        //     const swiperSlide = getElement('div', ['swiper-slide']);
        //     const card = getElement('figure', ['card']);
        //     const cardDescription = getElement('figcaption', ['card-description']);
        //     const episodeWrapper = getElement('a', null, { href: slide.href, target: 'blank' });
        //     const episodePreview = getElement('img', ['card-img'], { src: slide.episodePicture, alt: slide.episodeNumber });

        //     cardDescription.append(
        //         getElement('p', ['card-subtitle'], { textContent: slide.episodeNumber }),
        //         getElement('p', ['card-title'], { textContent: slide.episodeName })
        //     );

        //     episodeWrapper.append(card);
        //     card.append(episodePreview, cardDescription);

        //     swiperSlide.append(card);

        //     return swiperSlide;
        // };

        const renderSlide = slide => {
            const swiperSlide = getElement('div', ['swiper-slide']);
            swiperSlide.innerHTML = `
            <a href="${slide.href}" target="_blank">
            <figure class="card">
                <img class="card-img" src="${slide.episodePicture}" alt="${slide.episodeNumber}">
                <figcaption class="card-description">
                  <p class="card-subtitle">${slide.episodeNumber}</p>
                  <p class="card-title">${slide.episodeName}</p>
                </figcaption>
            </figure>
            <a/>
            `;

            return swiperSlide;
        };

        episodes.forEach(item => {
            swiperWrapper.append(renderSlide(item));
        });

        container.append(episodesContainer);
        episodesContainer.append(swiperContainer, getElement('button', ['arrow']));
        swiperContainer.append(swiperWrapper);
    }

    return main;
};

const createFooter = ({ footer: { copyright, menu } }) => {
    const footer = getElement('footer', ['footer']);
    const container = getElement('div', ['container']);
    const footerContent = getElement('div', ['footer-content']);
    const left = getElement('div', ['left']);
    const right = getElement('div', ['right']);
    const footerNav = getElement('nav', ['footer-menu']);

    menu.forEach(item => {
        const footerMenuItem = getElement('a', ['footer-link'], {
            textContent: item.title,
            href: item.href,
        });
        footerNav.append(footerMenuItem);
    });

    footer.append(container);
    container.append(footerContent);

    footerContent.append(left, right);
    left.append(getElement('span', ['copyright'], { textContent: copyright }));
    right.append(footerNav);

    return footer;
};

const movieConstructor = (selector, options) => {
    const app = document.querySelector(selector);
    document.title = options.title;
    document.head.append(
        getElement("link", null, {
            href: options.header.logo,
            type: "image/x-icon",
            rel: "shortcut icon",
        })
    );

    app.classList.add("body-app");
    app.style.backgroundImage = options.background ?
        `url(${options.background})` :
        "none";

    if (options.header) {
        app.append(createHeader(options));
    }

    if (options.main) {
        app.append(createMain(options));
    }

    if (options.footer) {
        app.append(createFooter(options));
    }
};

movieConstructor(".app", {
    title: "Witcher",
    background: "./witcher/background.jpg",
    header: {
        logo: "./witcher/logo.png",
        social: [
            {
                title: "Twitter",
                link: "#",
                image: "./witcher/social/twitter.svg",
            },
            {
                title: "Instagram",
                link: "#",
                image: "./witcher/social/instagram.svg",
            },
            {
                title: "Facebook",
                link: "#",
                image: "./witcher/social/facebook.svg",
            },
        ],
        menu: [
            {
                title: "Описание",
                link: "#",
            },
            {
                title: "Трейлер",
                link: "#",
            },
            {
                title: "Отзывы",
                link: "#",
            },
        ],
    },
    main: {
        genre: "2019, Fantasy",
        rating: "8",
        description:
      "Ведьмак Геральт, мутант и убийца чудовищ, на своей верной лошади по кличке Плотва путешествует по Континенту. За тугой мешочек чеканных монет этот мужчина избавит вас от всякой настырной нечисти — хоть от чудищ болотных, оборотней и даже заколдованных принцесс.",
        trailer: "https://www.youtube.com/watch?v=P0oJqfLzZzQ",
        episodes: [
            {
                episodePicture: './witcher/series/series-1.jpg',
                episodeNumber: 'Серия №1',
                episodeName: 'Начало конца',
                href: 'https://witchertv.ru/see_online/season_1/01-01.php',
            },
            {
                episodePicture: './witcher/series/series-2.jpg',
                episodeNumber: 'Серия №2',
                episodeName: 'Четыре марки',
                href: 'https://witchertv.ru/see_online/season_1/0102.php',
            },
            {
                episodePicture: './witcher/series/series-3.jpg',
                episodeNumber: 'Серия №3',
                episodeName: 'Предательская луна',
                href: 'https://witchertv.ru/see_online/season_1/0103.php',
            },
            {
                episodePicture: './witcher/series/series-4.jpg',
                episodeNumber: 'Серия №4',
                episodeName: 'Банкеты, ублюдки и похороны',
                href: 'https://witchertv.ru/see_online/season_1/0104.php',
            },
        ]
    },
    footer: {
        copyright: "© 2020 The Witcher. All right reserved.",
        menu: [
            {
                href: '#',
                title: 'Privacy Policy',
            },
            {
                href: '#',
                title: 'Terms of Service',
            },
            {
                href: '#',
                title: 'Legal',
            },
        ]
    }
});



//swiper settings
new Swiper('.swiper-container', {
    loop: true,
    autoplay: true,
    effect: 'slide',
    navigation: {
        nextEl: '.arrow',
    },
    breakpoints: {
        320: {
            slidesPerView: 1,
            spaceBetween: 20
        },
        541: {
            slidesPerView: 2,
            spaceBetween: 40
        }
    }
});
