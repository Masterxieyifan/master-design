<template>
    <div class="tour">
        <md-tour-step
            v-if="steps[current]"
            :total="steps.length"
            :index="current"
            :step="steps[current]"
            :key="current"
            :next-step="nextStep"
            :stop="stop"
            :skip="skip"
            :finish="finish"
            :is-last="isLast"
            :stop-on-fail="customOptions.stopOnTargetNotFound"
            @targetNotFound="$emit('targetNotFound', $event)"
        >
        </md-tour-step>
    </div>
</template>

<script>
const DEFAULT_CALLBACKS = {
    onStart: Function.prototype,
    onPreviousStep: Function.prototype,
    onNextStep: Function.prototype,
    onStop: Function.prototype,
    onSkip: Function.prototype,
    onFinish: Function.prototype,
};

const DEFAULT_OPTIONS = {
    startTimeout: 0,
    stopOnTargetNotFound: true,
    useKeyboardNavigation: true,
    enabledNavigationKeys: {
        escape: true,
        arrowRight: true,
        arrowLeft: true
    },
};

const KEYS = {
    ARROW_RIGHT: 39,
    ARROW_LEFT: 37,
    ESCAPE: 27,
};

export default {
    name: 'MdTour',
    props: {
        steps: {
            type: Array,
            default: () => []
        },
        name: {
            type: String
        },
        options: {
            type: Object,
            default: () => DEFAULT_OPTIONS,
        },
        callbacks: {
            type: Object,
            default: () => DEFAULT_CALLBACKS,
        },
    },
    data() {
        return {
            current: -1,
        };
    },
    mounted() {
        //...
    },
    beforeDestroy() {
        // Remove the keyup listener if it has been defined
        if (this.customOptions.useKeyboardNavigation) {
            window.removeEventListener('keyup', this.handleKeyup);
        }
    },
    computed: {
        customOptions() {
            return {
                ...DEFAULT_OPTIONS,
                ...this.options
            };
        },
        customCallbacks() {
            return {
                ...DEFAULT_CALLBACKS,
                ...this.callbacks
            };
        },
        isRunning() {
            return this.current > -1 && this.current < this.numberOfSteps;
        },
        isFirst() {
            return this.current === 0;
        },
        isLast() {
            return this.current === this.steps.length - 1;
        },
        numberOfSteps() {
            return this.steps.length;
        },
        step() {
            return this.steps[this.current];
        },
    },
    methods: {
        async start(startStep) {
            const paramType = typeof startStep;
            let startIdx = 0;
            if (paramType === 'string') {
                // 根据 ID
                startIdx = this.steps.findIndex(item => item. id === startStep);
                startIdx = startIdx > -1 ? startIdx : 0;
            } else if (paramType === 'number') {
                // 根据索引
                startIdx = parseInt(startStep, 10);
                startIdx = (startStep > -1 && startStep < this.steps.length) ? startStep : 0;
            }

            if (this.customOptions.useKeyboardNavigation) {
                window.addEventListener('keyup', this.handleKeyup);
            }

            let step = this.steps[startIdx];

            let process = () => new Promise((resolve) => {
                setTimeout(() => {
                    this.customCallbacks.onStart();
                    this.current = startIdx;
                    resolve();
                }, this.customOptions.startTimeout);
            });
            if (typeof step.before !== 'undefined') {
                try {
                    await step.before('start');
                } catch (e) {
                    return Promise.reject(e);
                }
            }
            await process();
            return Promise.resolve();
        },
        async previousStep() {
            let futureStep = this.current - 1;
            let process = () => new Promise((resolve) => {
                this.customCallbacks.onPreviousStep(this.current);
                this.current = futureStep;
                resolve();
            });
            if (futureStep > -1) {
                let step = this.steps[futureStep];
                if (typeof step.before !== 'undefined') {
                    try {
                        await step.before('previous');
                    } catch (e) {
                        return Promise.reject(e);
                    }
                }
                await process();
            }
            return Promise.resolve();
        },
        async nextStep() {
            let futureStep = this.current + 1;
            let process = () => new Promise((resolve) => {
                this.customCallbacks.onNextStep(this.current);
                this.current = futureStep;
                resolve();
            });
            if (futureStep < this.numberOfSteps && this.current !== -1) {
                let step = this.steps[futureStep];
                if (typeof step.before !== 'undefined') {
                    try {
                        await step.before('next');
                    } catch (e) {
                        return Promise.reject(e);
                    }
                }
                await process();
            }

            return Promise.resolve();
        },
        stop() {
            this.customCallbacks.onStop();
            document.body.classList.remove('tour--active');

            this.current = -1;
        },
        skip() {
            this.customCallbacks.onSkip();
            this.stop();
        },
        finish() {
            this.customCallbacks.onFinish();
            this.stop();
        },
        handleKeyup(e) {
            switch (e.keyCode) {
            case KEYS.ARROW_RIGHT:
                this.isKeyEnabled('arrowRight') && this.nextStep();
                break;
            // case KEYS.ARROW_LEFT:
            //     this.isKeyEnabled('arrowLeft') && this.previousStep();
            //     break;
            case KEYS.ESCAPE:
                this.isKeyEnabled('escape') && this.stop();
                break;
            }
        },
        isKeyEnabled(key) {
            const { enabledNavigationKeys } = this.customOptions;
            // eslint-disable-next-line no-prototype-builtins
            return enabledNavigationKeys.hasOwnProperty(key) ? enabledNavigationKeys[key] : true;
        },
    }
};
</script>
