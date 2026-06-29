import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollFeature.css';

gsap.registerPlugin(ScrollTrigger);

export const ScrollFeature = () => {
  useEffect(() => {
    // Pin the intro text section
    const pin = ScrollTrigger.create({
      trigger: ".intro-wrapper",
      start: "top top",
      end: "bottom top",
      pin: ".text-align-center",
      pinSpacing: false
    });

    // Handling the scroll for the tabs strictly as provided in scroll.md
    const handleScroll = function () {
      let scrollPosition = window.scrollY;
      let windowHeight = window.innerHeight + 550; // +550 = increasing the scroll distance before each class changes
      let sections = document.querySelectorAll('.tabs_let-content');
      let videos = document.querySelectorAll('.tabs_video');
      let lastSectionIndex = sections.length - 1;

      sections.forEach((section, index) => {
        if (scrollPosition >= (index * windowHeight) && scrollPosition < ((index + 1) * windowHeight)) {
          section.classList.add('is-1');
          if (videos[index]) videos[index].classList.add('is-1');
        } else {
          // Remove is-1 class from all sections except the last one
          if (index !== lastSectionIndex) {
            section.classList.remove('is-1');
            if (videos[index]) videos[index].classList.remove('is-1');
          }
        }
      });

      // Keep is-1 class on the last section until user scrolls past it
      if (scrollPosition > (lastSectionIndex * windowHeight)) {
        if (sections[lastSectionIndex]) sections[lastSectionIndex].classList.add('is-1');
        if (videos[lastSectionIndex]) videos[lastSectionIndex].classList.add('is-1');
      } else {
        if (sections[lastSectionIndex]) sections[lastSectionIndex].classList.remove('is-1');
        if (videos[lastSectionIndex]) videos[lastSectionIndex].classList.remove('is-1');
      }
    };

    document.addEventListener("scroll", handleScroll);

    // Initial call
    handleScroll();

    return () => {
      pin.kill();
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="scroll-feature-container">
      <div className="intro-wrapper">
        <div className="intro" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div className="text-align-center" id="js-pin">
            <div className="max-width-small align-center">
              <div className="margin-bottom margin-small">
                <h2 className="heading-style-h3">
                  <span className="light-green-underline">149€/month</span> &amp; not a single worry
                </h2>
              </div>
              <p className="text-size-medium">
                We take care of registration, insurance, and maintenance to ensure you have a hassle-free ride! 
                <sup>*including theft coverage under certain conditions.</sup>
              </p>
            </div>
          </div>
        </div>
      </div>

      <section className="section_tabs" style={{ zIndex: 2 }}>
        <div className="padding-section-large">
          <div className="tabs_height">
            <div className="tabs_sticky-wrapper">
              <div className="tabs_container">
                <div className="tabs_component">
                  <div className="tabs_left">
                    <div className="tabs_left-top">
                      <div className="tabs_let-content is-1">
                        <h2 className="heading-style-h4 text-color-gray100">
                          Reinventing micro-mobility with <span className="text-color-green">Award winning</span> design
                        </h2>
                        <div className="tabs_line"></div>
                        <p className="text-size-small text-color-gray400">
                          Our mission is to close the gap between a scooter and a bike. Yoda is the lightest vehicle of its category, designed to be agile and fun for everyone to ride.
                        </p>
                      </div>
                      <div className="tabs_let-content is-2">
                        <h2 className="heading-style-h4 text-color-gray100">
                          Best in class energy management for <span className="text-color-green">optimal autonomy</span>
                        </h2>
                        <div className="tabs_line"></div>
                        <p className="text-size-small text-color-gray400">
                          3 riding modes: 🌱 eco, ⚡️ normal &amp; 🚀 boost - that offer up to 80 km range on one single charge with a swappable battery.
                        </p>
                      </div>
                      <div className="tabs_let-content is-3">
                        <h2 className="heading-style-h4 text-color-gray100">
                          Durable and effortless, <span className="text-color-green">all the way</span>
                        </h2>
                        <div className="tabs_line"></div>
                        <p className="text-size-small text-color-gray400">
                          We spent years crafting Yoda, stripping away unnecessary components to deliver a <strong>simple</strong> and <strong>efficient</strong> mobility experience.
                        </p>
                      </div>
                    </div>
                    
                    <div className="tabs_left-bottom">
                      <div className="button is-green is-secondary">
                        <div className="button-text">Order today</div>
                        <div className="button-circle-wrapper">
                          <div className="button-icon _1 w-embed">
                            <svg height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4.66699 11.3332L11.3337 4.6665" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                              <path d="M4.66699 4.6665H11.3337V11.3332" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                          </div>
                          <div className="button-icon _2 w-embed">
                            <svg height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4.66699 11.3332L11.3337 4.6665" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                              <path d="M4.66699 4.6665H11.3337V11.3332" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                          </div>
                        </div>
                        <div className="button-circlee background-color-green"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="tabs_right">
                    <div className="tabs_video is-1 w-background-video w-background-video-atom" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                      <video id="video-1" autoPlay loop muted playsInline data-object-fit="cover">
                        <source src="https://assets-global.website-files.com/65ae37af356fab4845432048/65be0fdac914d702e08f70ed_Yoda-Helmet_1-transcode.mp4" data-wf-ignore="true" />
                        <source src="https://assets-global.website-files.com/65ae37af356fab4845432048/65be0fdac914d702e08f70ed_Yoda-Helmet_1-transcode.webm" data-wf-ignore="true" />
                      </video>
                      <img src="https://assets-global.website-files.com/65ae37af356fab4845432048/65b0dc37d226a551affbf2ea_GDA24_HO_WINNER_MC_RGB.webp" loading="lazy" sizes="(max-width: 479px) 56px, 80px" srcSet="https://assets-global.website-files.com/65ae37af356fab4845432048/65b0dc37d226a551affbf2ea_GDA24_HO_WINNER_MC_RGB-p-500.png 500w, https://assets-global.website-files.com/65ae37af356fab4845432048/65b0dc37d226a551affbf2ea_GDA24_HO_WINNER_MC_RGB.webp 1298w" alt="German design award winner 2024 logo" className="tabs_video-gda-badge" />
                    </div>
                    
                    <div className="tabs_video w-background-video w-background-video-atom">
                      <video id="video-2" autoPlay loop muted playsInline data-object-fit="cover">
                        <source src="https://assets-global.website-files.com/65ae37af356fab4845432048/65ae37af356fab48454320ae_BatteryRemoval_Pingpong_001-transcode.mp4" data-wf-ignore="true" />
                        <source src="https://assets-global.website-files.com/65ae37af356fab4845432048/65ae37af356fab48454320ae_BatteryRemoval_Pingpong_001-transcode.webm" data-wf-ignore="true" />
                      </video>
                    </div>
                    
                    <div className="tabs_video w-background-video w-background-video-atom">
                      <video id="video-3" autoPlay loop muted playsInline data-object-fit="cover">
                        <source src="https://assets-global.website-files.com/65ae37af356fab4845432048/65be104f9aba74d774b7f4a3_Yoda-Exploded-50-transcode.mp4" data-wf-ignore="true" />
                        <source src="https://assets-global.website-files.com/65ae37af356fab4845432048/65be104f9aba74d774b7f4a3_Yoda-Exploded-50-transcode.webm" data-wf-ignore="true" />
                      </video>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div style={{ height: '50vh' }}></div>
    </div>
  );
};

export default ScrollFeature;
