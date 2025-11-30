'use client';

import React, {useLayoutEffect, useRef, forwardRef, useImperativeHandle} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import SVGComponent from "@/components/svgs/svgviewer-react-output";

gsap.registerPlugin(ScrollTrigger);

const steps = [
    {label: "Step 1"},
    {label: "Step 2"},
    {label: "Step 3"},
];

const GsapTestingPage = forwardRef((props, ref) => {
    const container = useRef(null);
    useImperativeHandle(ref, () => container.current);

    useLayoutEffect(() => {
        if (!container.current) return;

        const ctx = gsap.context(() => {
            const groups = gsap.utils.toArray(".svg-group");
            const stepCircles = gsap.utils.toArray(".step-circle");
            const stepTitles = gsap.utils.toArray(".step-title");
            const stepBorders = gsap.utils.toArray(".step-border");
            const stepSummary = gsap.utils.toArray(".step-summary");

            groups.forEach(group => {
                gsap.set(group.children, {
                    opacity: 0,
                    x: () => gsap.utils.random(-200, 200),
                    y: () => gsap.utils.random(-200, 200),
                });
            });
            gsap.set(groups[0].children, {opacity: 1, x: 0, y: 0});

            gsap.set(stepCircles, {scale: 0.8, backgroundColor: "#d1d5db"});
            gsap.set(stepCircles[0], {scale: 1.1, backgroundColor: "#dc2626"});

            gsap.set(stepTitles, {opacity: 0.4});
            gsap.set(stepTitles[0], {opacity: 1, color: "#dc2626"});

            gsap.set(stepSummary, {height: 0, opacity: 0, marginTop: 0});
            gsap.set(stepSummary[0], {height: "auto", opacity: 1, marginTop: "0.5rem"});

            gsap.set(stepBorders, {scaleY: 0, transformOrigin: "top center"});
            gsap.set(stepBorders[0], {scaleY: 1});


            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container.current,
                    start: "top top",
                    end: "+=1000",
                    scrub: 0.5,
                    pin: true,
                    snap: {
                        snapTo: 1 / (steps.length - 1),
                        duration: {min: 0.2, max: 0.5},
                        delay: 0.1,
                        ease: "power1.inOut"
                    },
                }
            });

            groups.forEach((group, index) => {
                if (index > 0) {
                    const prevIndex = index - 1;
                    const shapes = group.children;

                    tl.to(stepBorders[prevIndex], {
                        scaleY: 0,
                        transformOrigin: "bottom center",
                        duration: 1,
                        ease: "none"
                    }); // No position param implies "append to end"

                    tl.to(stepBorders[index], {
                        scaleY: 1,
                        transformOrigin: "top center",
                        duration: 1,
                        ease: "none"
                    }, "<");


                    tl.to(stepCircles[prevIndex], {scale: 0.8, backgroundColor: "#d1d5db", duration: 0.5}, "<");
                    tl.to(stepCircles[index], {scale: 1.1, backgroundColor: "#dc2626", duration: 0.5}, "<");

                    tl.to(stepTitles[prevIndex], {opacity: 0.4, color: "#000", duration: 0.5}, "<");
                    tl.to(stepTitles[index], {opacity: 1, color: "#dc2626", duration: 0.5}, "<");

                    tl.to(stepSummary[prevIndex], {height: 0, opacity: 0, marginTop: 0, duration: 0.5}, "<");
                    tl.to(stepSummary[index], {height: "auto", opacity: 1, marginTop: "0.5rem", duration: 0.5}, "<");

                    tl.to(groups[prevIndex].children, {
                        x: () => gsap.utils.random(-500, 500),
                        y: () => gsap.utils.random(-300, 300),
                        opacity: 0,
                        duration: 1,
                        ease: "power2.in",
                        stagger: {amount: 0.15, from: "random"}
                    }, "<");

                    tl.to(shapes, {
                        x: 0, y: 0, opacity: 1, duration: 1, ease: "power2.out",
                        stagger: {amount: 0.2, from: "random"}
                    }, "<+=0.2");
                }
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div ref={container} className="w-full relative overflow-hidden h-screen bg-white">
            <div className="flex w-full h-full max-w-6xl mx-auto">

                <div className="basis-1/2 flex items-center justify-center sticky top-0 h-screen">
                    <div className="relative w-[400px] h-[400px]">
                        <SVGComponent className="svg-group absolute inset-0 m-auto"/>
                        <SVGComponent className="svg-group absolute inset-0 m-auto"/>
                        <SVGComponent className="svg-group absolute inset-0 m-auto"/>
                    </div>
                </div>

                <div className="basis-1/2 flex flex-col justify-center py-20 pl-10">
                    <div className="flex flex-col w-full">
                        {steps.map((step, i) => (
                            <div key={i} className="flex flex-row items-stretch">
                                <div
                                    className="relative w-1.5 bg-gray-200 mr-8 flex-shrink-0  overflow-hidden">
                                    <div
                                        className="step-border absolute top-0 left-0 w-full h-full bg-red-600 origin-top"></div>
                                </div>

                                <div className="flex flex-col pt-2">
                                    <div className="flex items-center mb-2">
                                        <div
                                            className="step-circle w-8 h-8 aspect-square rounded-full  flex items-center justify-center text-sm mr-4 bg-gray-800 text-white">
                                            {i + 1}
                                        </div>
                                        <h3 className="step-title text-2xl font-bold transition-colors">
                                            {step.label}
                                        </h3>
                                    </div>
                                    <div className="step-summary overflow-hidden pl-8">
                                        <p className="text-gray-600 leading-relaxed text-lg">
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default GsapTestingPage;