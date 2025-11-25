"use client";

import {forwardRef, useImperativeHandle, useLayoutEffect, useRef} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GsapTestingPage = forwardRef((props, ref) => {
    const container = useRef(null);
    useImperativeHandle(ref, () => container.current);

    useLayoutEffect(() => {
        if (!container.current) return;
        gsap.set("#groupA, #groupB, #groupC", {opacity: 0});

        const ctx = gsap.context(() => {
            const groups = ["A", "B", "C"];

            function animateIn(group) {
                gsap.to(`#group${group}`, {x: 0, y: 0, opacity: 1, duration: 0.5});
            }

            function animateOut(group) {
                gsap.to(`#group${group}`, {x: (group === "B" ? 200 : -200), y: -100, opacity: 0, duration: 0.5});
            }


            groups.forEach((group, i) => {
                console.log("scroll trigger created for group" + group);
                ScrollTrigger.create({
                    trigger: `#group${group}`,
                    start: `top center`,
                    end: "bottom center",
                    toggleActions: "play reverse play reverse",
                    onEnter: () => {
                        animateIn(group);
                    },
                    onEnterBack: () => {
                        animateIn(group);
                    },
                    onLeaveBack: () => {
                        animateOut(group);
                    },
                    onLeave: () => {
                        animateOut(group);
                    },

                    markers: true,
                });
            });
        }, container);

        return () => ctx.revert();
    }, []);


    return (<div ref={container} className="h-[300vh] py-120">
        <svg width="600" height="200" viewBox="0 0 600 400" id="groupA">
            <circle className="a-circle" cx="100" cy="200" r="40" fill="red"/>
            <rect className="a-rect" x="200" y="150" width="80" height="80" fill="orange"/>
        </svg>
        <svg width="600" height="200" viewBox="0 0 600 400" id='groupB'>
            <circle className="b-circle" cx="150" cy="200" r="40" fill="green"/>
            <rect className="b-rect" x="250" y="150" width="80" height="80" fill="blue"/>
        </svg>
        <svg width="600" height="200" viewBox="0 0 600 400" id='groupC'>
            <circle className="c-circle" cx="120" cy="200" r="40" fill="purple"/>
            <rect className="c-rect" x="300" y="150" width="80" height="80" fill="pink"/>
        </svg>
        {/*</div>*/}
    </div>);
});

export default GsapTestingPage;
