import { LeadershipSection } from "../components/sections/LeadershipSection";
export function Investors() {
  return (
    <>
      <main className="investors-page">
        <section className="investors-hero" aria-label="Investors hero">
          {/* <div className="investors-hero__image" aria-hidden="true" /> */}
          <div className="investors-hero__content container">
            <div className="investors-hero__title-wrap">
              <h1 className="investors-hero__title">Investors</h1>
              <span className="investors-hero__title-line" aria-hidden="true" />
            </div>
          </div>

          {/* <div className="investors-hero__wave-group" aria-hidden="true">
           <span className="investors-hero__wave investors-hero__wave--one" />
          <span className="investors-hero__wave investors-hero__wave--two" /> 
           <span className="investors-hero__wave investors-hero__wave--three" /> 
          <span className="investors-hero__wave investors-hero__wave--four" />
          <span className="investors-hero__wave investors-hero__wave--five" />
        </div> */}

          <div className="investors-hero__breadcrumb">
            <div className="container">
              <p className="investors-hero__breadcrumb-text">
                <a href="/">Home</a>
                <span
                  className="investors-hero__breadcrumb-separator"
                  aria-hidden="true"
                >
                  &#10132;
                </span>
                <a href="/investors">Investors</a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <LeadershipSection />
    </>
  );
}

export default Investors;
