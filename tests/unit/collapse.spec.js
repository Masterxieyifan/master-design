import chai from 'chai';
import { shallowMount, mount, } from '@vue/test-utils';
import collapse from '../../packages/collapse/src/collapse.vue';

describe('collapse.vue', () => {
    it('renders props.isPure when passed', () => {
        const wrapper = shallowMount(collapse, {
            propsData: { isPure: true }
        });
        chai.expect(wrapper.props().isPure).to.be.true;
    });
    it('test click', async () => {
        const wrapper = mount(collapse, {
            propsData: { padding: false }
        });
        const content = wrapper.find('.collapse-content');
        const button = wrapper.find('.toggle-button');
        chai.expect(content.isVisible()).to.be.true;
        await button.trigger('click');
        chai.expect(content.isVisible()).to.be.not.true;
        await button.trigger('click');
        chai.expect(content.isVisible()).to.be.true;
    });
    it('test slot', () => {
        const wrapper = mount(collapse, {
            slots: {
                default: '<div class="slot">test slot</div>'
            }
        });
        const text = wrapper.find('.slot').text();
        chai.expect(text).to.eql('test slot');
    });
});
