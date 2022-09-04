export default {
    name: 'MdRender',
    props: {
        render: {
            type: Function,
            required: true,
        },
    },
    render(h) {
        return this.render(h);
    },
};
