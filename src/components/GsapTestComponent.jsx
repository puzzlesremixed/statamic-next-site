'use client';

import React, {useLayoutEffect, useRef, forwardRef, useImperativeHandle, useEffect} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import {Swiper, SwiperSlide} from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

import {Mousewheel, Pagination} from 'swiper/modules';
import Svg1 from "@/components/svgs/svg1";
import SVGComponent from "@/components/svgs/svgviewer-react-output";

gsap.registerPlugin(ScrollTrigger);

const GsapTestingPage = forwardRef((props, ref) => {
    const container = useRef(null);
    // const swiperRef = useRef(null);

    useImperativeHandle(ref, () => container.current);

    useLayoutEffect(() => {
        if (!container.current) return;

        const ctx = gsap.context(() => {
            const groups = gsap.utils.toArray(".svg-group");

            // set initai posiiton of each group child
            groups.forEach(group => {
                gsap.set(group.children, {
                    opacity: 0, x: () => gsap.utils.random(-200, 200), y: () => gsap.utils.random(-200, 200),
                });
            });

            // set the first group to visible
            gsap.set(groups[0].children, {
                opacity: 1, x: 0, y: 0,
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container.current,
                    start: "top top+=30%",
                    // toggleAction: "restart pause reverse pause",
                    // end: "+=150%",
                    pin: true,
                    // pinSpacing: false,
                    scrub: 1,
                    snap: {
                        snapTo: 1 / (groups.length - 1),
                        // duration: 0.5,
                        ease: "power2.out",
                    },
                    markers: true,
                },
            });

            groups.forEach((group, index) => {
                const shapes = group.children;

                // entrance anim
                if (index > 0) {
                    tl.add(gsap.to(shapes, {
                        x: 0, y: 0, // scale: 1,
                        opacity: 1, duration: 1, ease: "power2.out", stagger: {amount: 0.2, from: "random"}
                        // before the start of last anim
                    }), "<-0.1");
                }
                tl.add(gsap.to({}, {duration: 0.5}));
                // exit animation 
                if (index < groups.length - 1) {
                    tl.add(gsap.to(shapes, {
                        x: () => gsap.utils.random(-500, 500),
                        y: () => gsap.utils.random(-300, 300),
                        opacity: 0,
                        duration: 1,
                        ease: "power2.in",
                        stagger: {amount: 0.15, from: "random"}
                        // before the end of last anim
                    }), ">-0.1");

                }
            })

        }, container);

        return () => ctx.revert();
    });

    return (<div ref={container} className="w-full relative overflow-hidden my-24" id="gsapPinned">
        <div className="w-full h-[296px] flex ">
            <div className="basis-1/2 flex items-center justify-center relative">
                <div className="relative w-[296px] h-[296px]">
                    <SVGComponent className="absolute inset-0 m-auto"/>
                    <SVGComponent className="absolute inset-0 m-auto"/>
                    <SVGComponent className="absolute inset-0 m-auto"/>
                </div>
            </div>
            <div className="bg-red-700  basis-1/2">
                <p>Step 1</p>
                <p>Step 2</p>
                <p>Step 3</p>
            </div>
        </div>
    </div>)
});

export default GsapTestingPage;