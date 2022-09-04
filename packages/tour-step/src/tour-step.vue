<template>
    <div
        :class="['tour-step', 'el-popper', { 'tour-step--sticky': isSticky }]"
        :id="'tour-step-' + hash"
        :ref="'tour-step-' + hash"
    >
        <slot name="header">
            <div
                v-if="step.header"
                class="tour-step__header"
            >
                <div v-if="step.header.title" v-html="step.header.title"></div>
            </div>
        </slot>
        <slot name="content">
            <div class="tour-step__content">
                <div v-if="step.content" v-html="step.content"></div>
            </div>
        </slot>
        <slot name="actions">
            <div class="tour-step__buttons">
                <template v-if="isLast">
                     <span v-show="isLast" class="tour-step__space"></span>
                    <button
                        v-show="isLast"
                        class="tour-step__button tour-step__button-stop"
                        @click.prevent="finish"
                    >
                        知道了
                    </button>
                </template>
                <template v-else>
                    <button
                        class="tour-step__button tour-step__button-skip"
                        @click.prevent="skip"
                    >
                        跳过({{ index+1 }}/{{ total }})
                    </button>
                    <button
                        class="tour-step__button tour-step__button-next"
                        @click.prevent="nextStep"
                    >
                        下一步
                    </button>
                </template>
            </div>
        </slot>
        <div
            :class="[
                'tour-step__arrow',
                { 'tour-step__arrow--dark': step.header && step.header.title }
            ]"
            data-popper-arrow
        >
        </div>
    </div>
</template>
<script>
import { createPopper } from '@popperjs/core';
import sum from 'hash-sum';

const DEFAULT_STEP_OPTIONS = {
    // enableScrolling: true,
    modifiers: [
        {
            name: 'arrow',
            options: {
                element: '.tour-step__arrow',
                padding: 10
            }
        },
        {
            name: 'preventOverflow',
            options: {
                rootBoundary: 'window'
            }
        },
        {
            name: 'offset',
            options: {
                offset: [0, 10]
            }
        }
    ],
    placement: 'bottom'
};

// const HIGHLIGHT = {
//     classes: {
//         active: 'tour--active',
//         targetHighlighted: 'tour__target--highlighted',
//         targetRelative: 'tour__target--relative'
//     },
//     transition: 'box-shadow 0s ease-in-out 0s'
// };

export default {
    name: 'MdTourStep',
    props: {
        index: {
            type: Number,
        },
        total: {
            type: Number
        },
        step: {
            type: Object
        },
        nextStep: {
            type: Function
        },
        stop: {
            type: Function
        },
        skip: {
            type: Function,
            default: function() {
                this.stop();
            }
        },
        finish: {
            type: Function,
            default: function() {
                this.stop();
            }
        },
        isLast: {
            type: Boolean
        },
        stopOnFail: {
            type: Boolean
        },
    },
    data() {
        return {
            hash: sum(this.step.target),
            targetElement: document.querySelector(this.step.target)
        };
    },
    computed: {
        params() {
            return {
                ...DEFAULT_STEP_OPTIONS,
                ...this.step.params // Then use local step parameters if defined
            };
        },
        isSticky() {
            return !this.step.target;
        },
    },
    methods: {
        createStep() {
            if (this.isSticky) {
                document.body.appendChild(this.$refs['tour-step-' + this.hash]);
            } else {
                if (this.targetElement) {
                    this.enableScrolling();
                    // this.createHighlight();
                    createPopper(
                        this.targetElement,
                        this.$refs['tour-step-' + this.hash],
                        this.params
                    );
                } else {
                    this.$emit('targetNotFound', this.step);
                    if (this.stopOnFail) {
                        this.stop();
                    }
                }
            }
        },
        enableScrolling() {
            if (this.params.enableScrolling) {
                if (this.step.duration || this.step.offset) {
                    let jumpOptions = {
                        duration: this.step.duration || 1000,
                        offset: this.step.offset || 0,
                        callback: undefined,
                        a11y: false
                    };
                    this.jumper()(this.targetElement, jumpOptions);
                } else {
                    // Use the native scroll by default if no scroll options has been defined
                    this.targetElement.scrollIntoView({ behavior: 'smooth' });
                }

                this.targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        },
        // createHighlight() {
        //     document.body.classList.add(HIGHLIGHT.classes.active);
        //     const transitionValue = window.getComputedStyle(this.targetElement).getPropertyValue('transition');
        //     // Make sure our background doesn't flick on transitions
        //     if (transitionValue !== 'all 0s ease 0s') {
        //         this.targetElement.style.transition = `${transitionValue}, ${HIGHLIGHT.transition}`;
        //     }
        //     this.targetElement.classList.add(HIGHLIGHT.classes.targetHighlighted);
        //     // The element must have a position, if it doesn't have one, add a relative position class
        //     if (!this.targetElement.style.position) {
        //         this.targetElement.classList.add(HIGHLIGHT.classes.targetRelative);
        //     }
        // },
        // removeHighlight() {
        //     const target = this.targetElement;
        //     const currentTransition = this.targetElement.style.transition;
        //     this.targetElement.classList.remove(HIGHLIGHT.classes.targetHighlighted);
        //     this.targetElement.classList.remove(HIGHLIGHT.classes.targetRelative);
        //     // Remove our transition when step is finished.
        //     if (currentTransition.includes(HIGHLIGHT.transition)) {
        //         setTimeout(() => {
        //             target.style.transition = currentTransition.replace(`, ${HIGHLIGHT.transition}`, '');
        //         }, 0);
        //     }
        // },
        easeInOutQuad(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        },
        jumper() {
            // private variable cache
            // no variables are created during a jump, preventing memory leaks

            let element;        // element to scroll to                   (node)
            let start;          // where scroll starts                    (px)
            let stop;           // where scroll stops                     (px)
            let offset;         // adjustment from the stop position      (px)
            let easing;         // easing function                        (function)
            let a11y;           // accessibility support flag             (boolean)
            let distance;       // distance of scroll                     (px)
            let duration;       // scroll duration                        (ms)
            let timeStart;      // time scroll started                    (ms)
            let timeElapsed;    // time spent scrolling thus far          (ms)
            let next;            // next scroll position                   (px)
            let callback;       // to call when done scrolling            (function)

            // element offset helper
            function top(element) {
                return element.getBoundingClientRect().top + start;
            }

            // rAF loop helper
            function loop(timeCurrent) {
                // store time scroll started, if not started already
                if (!timeStart) {
                    timeStart = timeCurrent;
                }

                // determine time spent scrolling so far
                timeElapsed = timeCurrent - timeStart;

                // calculate next scroll position
                next = easing(timeElapsed, start, distance, duration);

                // scroll to it
                window.scrollTo(0, next);

                // check progress
                timeElapsed < duration
                    ? window.requestAnimationFrame(loop)       // continue scroll loop
                    : done();                                  // scrolling is done
            }

            // scroll finished helper
            function done() {
                // account for rAF time rounding inaccuracies
                window.scrollTo(0, start + distance);

                // if scrolling to an element, and accessibility is enabled
                if (element && a11y) {
                    // add tabindex indicating programmatic focus
                    element.setAttribute('tabindex', '-1');

                    // focus the element
                    element.focus();
                }

                // if it exists, fire the callback
                if (typeof callback === 'function') {
                    callback();
                }

                // reset time for next jump
                timeStart = false;
            }

            // API
            function jump(target, options = {}) {
                // resolve options, or use defaults
                duration = options.duration || 1000;
                offset = options.offset || 0;
                callback = options.callback;   // "undefined" is a suitable default, and won't be called
                easing = options.easing || this.easeInOutQuad;
                a11y = options.a11y || false;

                // cache starting position
                start = window.scrollY || window.pageYOffset;

                // resolve target
                switch (typeof target) {
                // scroll from current position
                case 'number':
                    element = undefined;          // no element to scroll to
                    a11y = false;                 // make sure accessibility is off
                    stop = start + target;
                    break;

                // scroll to element (node)
                // bounding rect is relative to the viewport
                case 'object':
                    element = target;
                    stop = top(element);
                    break;

                // scroll to element (selector)
                // bounding rect is relative to the viewport
                case 'string':
                    element = document.querySelector(target);
                    stop = top(element);
                    break;
                }

                // resolve scroll distance, accounting for offset
                distance = stop - start + offset;

                // resolve duration
                switch (typeof options.duration) {
                // number in ms
                case 'number':
                    duration = options.duration;
                    break;

                // function passed the distance of the scroll
                case 'function':
                    duration = options.duration(distance);
                    break;
                }

                // start the loop
                window.requestAnimationFrame(loop);
            }

            // expose only the jump method
            return jump;
        },
    },
    mounted() {
        this.createStep();
    },
    destroyed() {
        // this.removeHighlight();
    }
};
</script>