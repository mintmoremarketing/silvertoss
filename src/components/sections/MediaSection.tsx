import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const imagesBase = "/assets/images";

const mediaPosts = [
  {
    id: "round-logs",
    image: `${imagesBase}/process_1.jpg`,
    title: "From Log Yard to Selection",
    caption:
      "A closer look at how premium round timber logs are inspected, sorted, and prepared before entering production.",
    likes: "1.8k",
    comments: "124",
    tag: "Raw Material Story",
    handle: "@silvertossindustries",
  },
  {
    id: "frames",
    image: `${imagesBase}/process_2.jpg`,
    title: "Precision in Every Frame",
    caption:
      "Window and door frames crafted with clean joinery, consistent finish, and the structural quality required for long-term performance.",
    likes: "2.3k",
    comments: "176",
    tag: "Craftsmanship Focus",
    handle: "@silvertossindustries",
  },
  {
    id: "planks",
    image: `${imagesBase}/process_3.jpg`,
    title: "Planks Ready for Interiors",
    caption:
      "Processed wooden planks with uniform sizing, smooth surfaces, and a finish designed for high-end interior applications.",
    likes: "1.5k",
    comments: "98",
    tag: "Factory Update",
    handle: "@silvertossindustries",
  },
  {
    id: "round-logs",
    image: `${imagesBase}/process_1.jpg`,
    title: "From Log Yard to Selection",
    caption:
      "A closer look at how premium round timber logs are inspected, sorted, and prepared before entering production.",
    likes: "1.8k",
    comments: "124",
    tag: "Raw Material Story",
    handle: "@silvertossindustries",
  },
  {
    id: "frames",
    image: `${imagesBase}/process_2.jpg`,
    title: "Precision in Every Frame",
    caption:
      "Window and door frames crafted with clean joinery, consistent finish, and the structural quality required for long-term performance.",
    likes: "2.3k",
    comments: "176",
    tag: "Craftsmanship Focus",
    handle: "@silvertossindustries",
  },
  {
    id: "planks",
    image: `${imagesBase}/process_3.jpg`,
    title: "Planks Ready for Interiors",
    caption:
      "Processed wooden planks with uniform sizing, smooth surfaces, and a finish designed for high-end interior applications.",
    likes: "1.5k",
    comments: "98",
    tag: "Factory Update",
    handle: "@silvertossindustries",
  },
];

export function MediaSection() {
  return (
    <section className="content-section media-section" id="media">
      <div className="container">
        <div
          className="media-section__header"
          data-aos="fade-up"
          data-aos-duration="1000"
        >
          <p className="media-section__eyebrow">Media</p>
          <p className="media-section__intro">
            Highlighting sourcing, processing, and finished timber stories in a
            visual format that feels current and brand-led.
          </p>
        </div>

        <Swiper
          breakpoints={{
            576: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 0, disableOnInteraction: false }}
          speed={3000}
          className="media-section__slider"
          loop
          modules={[Autoplay]}
          slidesPerView={1}
          spaceBetween={24}
        >
          {mediaPosts.map((post, index) => (
            <SwiperSlide className="media-section__slide" key={post.id}>
              <article
                className="media-card"
                data-aos="fade-up"
                data-aos-delay={index * 120}
                data-aos-duration="1000"
              >
                <div className="media-card__media">
                  <img
                    alt={post.title}
                    className="media-card__image"
                    loading="lazy"
                    src={post.image}
                  />
                  {/* <span className="media-card__tag">{post.tag}</span> */}
                </div>

                {/* <div className="media-card__body">
                   <div className="media-card__identity">
                    <div className="media-card__avatar">
                      <i aria-hidden="true" className="fa-brands fa-instagram" />
                    </div>
                    <div className="media-card__account">
                      <strong>Silvertoss Industries</strong>
                      <span>{post.handle}</span>
                    </div>
                  </div> 

                   <h3 className="media-card__title">{post.title}</h3>
                  <p className="media-card__caption">{post.caption}</p> 

                   <div className="media-card__footer">
                    <div className="media-card__stats">
                      <span className="media-card__stat">
                        <i aria-hidden="true" className="fa-solid fa-heart" />
                        {post.likes}
                      </span>
                      <span className="media-card__stat">
                        <i aria-hidden="true" className="fa-solid fa-comment" />
                        {post.comments}
                      </span>
                    </div>
                    <div className="media-card__hashtags">
                      <span>#timbercraft</span>
                      <span>#silvertoss</span>
                    </div>
                  </div> 
                </div> */}
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default MediaSection;
