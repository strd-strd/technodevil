import { HeroTitle } from "@/app/components/hero-title";
import { LeadForm } from "@/app/components/lead-form";
import { PrivacyLink } from "@/app/components/privacy-dialog";
import { PromoButton } from "@/app/components/promo-button";
import { Reveal } from "@/app/components/reveal";
import { SiteEffects } from "@/app/components/site-effects";
import { SiteMenu } from "@/app/components/site-menu";
import { StatCounter } from "@/app/components/stat-counter";
import { TiltMedia } from "@/app/components/tilt-media";
import { YoutubeEmbed } from "@/app/components/youtube-embed";

const socials = [
  { href: "https://www.tiktok.com/@technodevil.ru", src: "/images/tiktok.svg", label: "TikTok" },
  { href: "https://vk.com/technodevil", src: "/images/vk.svg", label: "ВКонтакте" },
  { href: "https://instagram.com/techno.devil", src: "/images/instagram.svg", label: "Instagram" },
];

const videos = [
  "IE0s_mP3l_s",
  "qgbL_ZxNG5M",
  "MCAEs89NF1I",
  "3sPmO2YoK0Q",
  "25VrVCC_Ky8",
  "lhb3zlejdrU",
  "vNU1Njbo1E4",
  "9PyXIBrbaT8",
];

function SocialList() {
  return (
    <ul className="list">
      {socials.map((item) => (
        <li className="list__item" key={item.href}>
          <a className="list__link" href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
            <img className="list__img" src={item.src} alt="" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function HomePage() {
  return (
    <>
      <SiteEffects />

      <header className="header">
        <div className="container">
          <div className="header__top">
            <SiteMenu />
            <a className="header__logo logo" href="#top" aria-label="TECHNODEVIL">
              <img className="logo__img" src="/images/decor2.svg?v=2" alt="TECHNODEVIL" />
            </a>
            <SocialList />
          </div>
        </div>
        <div className="header__content" id="top">
          <div className="header__noise" aria-hidden="true" />
          <div className="header__vignette" aria-hidden="true" />
          <HeroTitle />
          <p className="title-descr title-descr--animated">Live Dj band from Nizhniy Novgorod</p>
        </div>
      </header>

      <section className="concept" id="concept">
        <div className="container">
          <div className="concept__inner">
            <Reveal as="h2" className="section__title">
              concept
            </Reveal>
            <Reveal as="p" className="concept__text" delay={80}>
              Природа проекта ТЕХНОДЬЯВОЛ представляет из себя органический аккумулятор энергии нового типа, собирает в
              себе самые лучшие достижения музыкальной сцены. Продуманная операционная стратегия проекта позволяет
              улучшить любое техно произведение в среднем на <StatCounter value={34} />, получаемые зрителем эмоции во
              время выступления зашкаливают.
            </Reveal>
            <Reveal delay={140}>
              <TiltMedia
                className="concept__img"
                src="/images/concept.webp"
                alt="TECHNODEVIL"
                width={1280}
                height={853}
                sizes="(max-width: 768px) 100vw, 415px"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="premier" id="premier">
        <div className="container">
          <div className="premier__inner">
            <div className="premier__column">
              <Reveal as="h2" className="section__title">
                PREMIER
              </Reveal>
              <Reveal as="p" className="premier__text" delay={60}>
                В 2020 году проектом ТЕХНОДЬЯВОЛ был представлен новый уникальный концепт Infernal Techno.
                Футуристическая концепция объединяет техно среднего темпа, эмоции человека и симбиоз живого ритма с
                индустриальными синтезаторами.
              </Reveal>
              <Reveal as="p" className="premier__text" delay={100}>
                Живые выступления проекта показывают весь спектр инстинктов зрителя и пробуждают самые потаённые
                чувства.
              </Reveal>
              <Reveal as="p" className="premier__text" delay={140}>
                Именно философия живого в мертвом, созданная в фантастических фильмах, стала основой ТЕХНОДЬЯВОЛА.
              </Reveal>
              <Reveal delay={180}>
                <TiltMedia
                  className="premier__img"
                  src="/images/premier-1.webp"
                  alt="Живые барабаны TECHNODEVIL"
                  width={960}
                  height={1080}
                  sizes="(max-width: 768px) 100vw, 415px"
                />
              </Reveal>
              <Reveal delay={220}>
                <a className="outline-btn premier__btn" href="#contacts">
                  КОНТАКТЫ
                </a>
              </Reveal>
            </div>
            <div className="premier__column">
              <Reveal delay={100}>
                <TiltMedia
                  className="premier__img"
                  src="/images/premier-2.webp"
                  alt="Выступление TECHNODEVIL"
                  width={960}
                  height={1080}
                  sizes="(max-width: 768px) 100vw, 415px"
                />
              </Reveal>
              <Reveal as="p" className="premier__text" delay={160}>
                «ТЕХНОДЬЯВОЛ всегда был одним из самых технологически премиальных коллективов на сцене страны. Мы поняли
                что пришло время объединить роскошь и разъебанный лоск андеграунда электронной сцены, добавив туда
                настоящее сознание живого человека. Ведь только так мы сможем соответствовать стандартам будущего»
                ©TECHNODEVIL
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="video" id="promo">
        <div className="container">
          <Reveal>
            <PromoButton />
          </Reveal>
          <div className="youvideo">
            {videos.map((id, index) => (
              <Reveal key={id} className="youvideo__item" delay={(index % 4) * 70}>
                <YoutubeEmbed id={id} title="TECHNODEVIL" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="design" id="live">
        <div className="container">
          <div className="design__interior">
            <Reveal className="design__cell-one">
              <h2 className="section__title">TECHNO & LIVE</h2>
              <p className="design__cell-text">
                Новаторская концепция Infernal Techno сочетает в себе органическое взаимодействие эмоций зрителя и
                исполнителя.
              </p>
              <p className="design__cell-text">
                Весь процесс ориентирован на конкретный результат - неповторимый опыт восприятия электронной музыки и
                живого ритма. Речь шла о создании уникального состояния, в котором зрители имеют биометрическую связь
                друг с другом и происходящим на сцене. Окружающая среда выступления проходит через внутреннюю часть души
                человека и создает бесконечную петлю эмоций, похожую на священную связь между людьми.
              </p>
              <p className="design__cell-text">
                Но кроме этого, музыкальная сторона проекта, дополненная живыми барабанами и пульсациями, повышает
                вовлеченность зрителя в процесс и увеличивает эффективность их чувств на протяжении всего выступления.
              </p>
              <p className="design__cell-text">
                Лаконичным продолжением стиля является внешний минимализм, выполненный в органической форме образования
                красного тумана, напоминающего появление жизни на бездушных просторах планеты Марс.
              </p>
            </Reveal>
            <Reveal className="design__media-main" delay={90}>
              <TiltMedia
                className="design__interior-img"
                src="/images/design-1.webp"
                alt="Сцена TECHNODEVIL"
                width={1600}
                height={1067}
                sizes="(max-width: 768px) 100vw, 510px"
              />
            </Reveal>
            <Reveal className="design__cell-two" delay={120}>
              <p className="design__cell-text">
                Благодаря среднему темпу треков и философии музыкантов, ТЕХНОДЬЯВОЛ демонстрирует радикально новый стиль
                техно музыки. Пройдя путь от концепции осознанности в музыке до уникального слияния живого человека и
                бездушных роботизированных синтезаторов и ритмов, музыкантам удалось создать неповторимый стиль.
              </p>
            </Reveal>
            <Reveal className="design__cell-three" delay={160}>
              <TiltMedia
                className="design__interior-img"
                src="/images/design-2.webp"
                alt="Красный свет TECHNODEVIL"
                width={1280}
                height={1200}
                sizes="(max-width: 768px) 100vw, 330px"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="feedback" id="contacts">
        <div className="container">
          <div className="feedback__inner">
            <Reveal>
              <LeadForm />
            </Reveal>
            <Reveal delay={100}>
              <TiltMedia
                className="design__img"
                src="/images/designtd.webp"
                alt="TECHNODEVIL"
                width={1600}
                height={1067}
                sizes="(max-width: 768px) 90vw, 700px"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer__inner">
            <PrivacyLink />
            <a className="logo" href="#top" aria-label="Наверх">
              <img className="logo__img-two" src="/images/decor22.svg?v=2" alt="" />
            </a>
            <SocialList />
          </div>
        </div>
      </footer>
    </>
  );
}
