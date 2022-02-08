import { module, test, skip } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { htmlSafe } from '@ember/template';

module('Integration | Component | line clamp', function (hooks) {
  setupRenderingTest(hooks);

  test('inline form works as expected', async function (assert) {
    assert.expect(18);

    await render(hbs`
      {{!-- template-lint-disable no-inline-styles --}}
      <div style="width: 300px; font-size: 16px; font-family: sans-serif;">
        <LineClamp @text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld" />
      </div>
    `);

    assert.ok(this.element, 'line clamp target exists');
    assert
      .dom('[data-test-line-clamp-line]')
      .exists({ count: 3 }, 'text is clamped at 3 lines (default)');

    assert
      .dom('[data-test-line-clamp-line]:first-child')
      .hasText('helloworld helloworld');
    assert
      .dom('[data-test-line-clamp-line]:nth-child(2)')
      .hasText('helloworld helloworld');
    assert
      .dom('[data-test-line-clamp-last-line]')
      .hasClass(
        'lt-line-clamp__line--last',
        'lt-line-clamp__line--last is applied to last line'
      );
    assert
      .dom('[data-test-line-clamp-last-line]')
      .hasClass(
        'lt-line-clamp__line--last',
        'lt-line-clamp__line--last is applied to last line'
      );

    assert
      .dom('[data-test-line-clamp-last-line] > *')
      .exists('last line contains 1 child');

    assert
      .dom('[data-test-line-clamp-last-line] > [data-test-line-clamp-ellipsis]')
      .exists('last line child is the ellipsis element and it exists')
      .hasClass(
        'lt-line-clamp__ellipsis',
        'ellipsis element contains right CSS class'
      )
      .hasText(
        '... See More',
        'Ellipsis element contains expetend ellipsis and see more text'
      );

    assert
      .dom('[data-test-line-clamp-show-more]')
      .exists('see more button exists')
      .hasClass(
        'lt-line-clamp__more',
        'see more button contains right CSS class'
      )
      .hasText('See More', 'see more button contains expected text');

    assert
      .dom('[data-test-line-clamp-dummy-ellipsis]')
      .exists('dummy ellipsis element exists')
      .hasText('...');

    await click('[data-test-line-clamp-show-more]');

    assert.dom('[data-test-line-clamp-show-less]').exists().hasText('See Less');
    assert.dom('[data-test-line-clamp-show-more]').doesNotExist();
  });

  test('lines attribute works as expected', async function (assert) {
    assert.expect(5);

    // Render component
    await render(hbs`
      {{!-- template-lint-disable no-inline-styles --}}
      <div style="width: 300px; font-size: 16px; font-family: sans-serif;">
        <LineClamp @text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
          @lines={{2}} />
      </div>
    `);

    assert.ok(this.element, 'line clamp target exists');
    assert
      .dom('[data-test-line-clamp-line]')
      .exists({ count: 2 }, 'text is clamped at 2 lines specified by user');

    assert
      .dom('[data-test-line-clamp-line]:first-child')
      .hasText('helloworld helloworld', 'first lines contain expected text');

    assert
      .dom('[data-test-line-clamp-line]:nth-child(2)')
      .hasClass(
        'lt-line-clamp__line--last',
        'lt-line-clamp__line--last is applied to last line'
      );

    assert.dom(this.element).containsText('... See More');
  });

  test('ellipsis attribute works as expected', async function (assert) {
    assert.expect(4);

    // Render component
    await render(hbs`
      {{!-- template-lint-disable no-inline-styles --}}
      <div style="width: 300px; font-size: 16px; font-family: sans-serif;">
        <LineClamp @text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
          @ellipsis="-" />
      </div>
    `);

    assert.ok(this.element, 'line clamp target exists');

    assert
      .dom('[data-test-line-clamp-ellipsis]')
      .exists()
      .hasText('- See More');

    assert.dom(this.element).containsText('- See More');
  });

  test('interactive=false hides see more button', async function (assert) {
    assert.expect(5);

    // Render component
    await render(hbs`
      {{!-- template-lint-disable no-inline-styles --}}
      <div style="width: 300px; font-size: 16px; font-family: sans-serif;">
        <LineClamp @text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
          @interactive={{false}} />
      </div>
    `);

    // We are running in headless chrome - it supports -webkit-line-clamp

    assert.ok(this.element, 'line clamp target exists');

    assert
      .dom(this.element)
      .hasText(
        'helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld'
      );

    assert
      .dom('[data-test-line-clamp]')
      .exists()
      .hasStyle(
        { '-webkit-line-clamp': '3' },
        'element fallbacks to -webkit-line-clamp'
      );

    assert
      .dom('[data-test-line-clamp-line]')
      .doesNotExist('No truncation happen, we use -webkit-line-clamp');
  });

  test('useJsOnly=true disables native CSS solution', async function (assert) {
    assert.expect(5);

    // Render component
    await render(hbs`
      {{!-- template-lint-disable no-inline-styles --}}
      <div style="width: 300px; font-size: 16px; font-family: sans-serif;">
        <LineClamp @text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
          @interactive={{false}} @useJsOnly={{true}} />
      </div>
    `);

    // We are running in headless chrome - it supports -webkit-line-clamp

    assert.ok(this.element, 'line clamp target exists');

    assert
      .dom('[data-test-line-clamp]')
      .exists()
      .hasStyle(
        { '-webkit-line-clamp': 'none' },
        'element fallbacks to -webkit-line-clamp'
      );

    assert
      .dom('[data-test-line-clamp-line]')
      .exists({ count: 3 }, 'No truncation happen, we use -webkit-line-clamp');

    assert.dom(this.element).containsText('...');
  });

  test('showMoreButton=false hides see more button', async function (assert) {
    assert.expect(6);

    // Render component
    await render(hbs`
      {{!-- template-lint-disable no-inline-styles --}}
      <div style="width: 300px; font-size: 16px; font-family: sans-serif;">
        <LineClamp @text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
          @lines={{2}} @showMoreButton={{false}} />
      </div>
    `);

    // We are running in headless chrome - it supports -webkit-line-clamp

    assert.ok(this.element, 'line clamp target exists');

    assert
      .dom('[data-test-line-clamp-line]')
      .doesNotExist('No truncation happen, we use -webkit-line-clamp');

    assert
      .dom('[data-test-line-clamp]')
      .exists()
      .hasStyle(
        { '-webkit-line-clamp': '2' },
        'element fallbacks to -webkit-line-clamp'
      );

    assert
      .dom(this.element)
      .containsText(
        'helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld'
      );

    assert.dom('[data-test-line-clamp-show-more]').doesNotExist();
  });

  test('showLessButton=false hides see less button', async function (assert) {
    assert.expect(5);

    // Render component
    await render(hbs`
      {{!-- template-lint-disable no-inline-styles --}}
      <div style="width: 300px; font-size: 16px; font-family: sans-serif;">
        <LineClamp @text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
          @lines={{2}} @showLessButton={{false}} />
      </div>
    `);

    assert.ok(this.element, 'line clamp target exists');

    assert
      .dom('[data-test-line-clamp-show-more]')
      .exists('see more button exists');

    await click('[data-test-line-clamp-show-more]');

    assert.dom('[data-test-line-clamp-show-more]').doesNotExist();
    assert.dom('[data-test-line-clamp-show-less]').doesNotExist();

    assert
      .dom('[data-test-line-clamp-raw]')
      .hasText(
        'helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld'
      );
  });

  test('seeMoreText and seeLessText attributes work as expected', async function (assert) {
    assert.expect(11);

    // Render component
    await render(hbs`
      {{!-- template-lint-disable no-inline-styles --}}
      <div style="width: 300px; font-size: 16px; font-family: sans-serif;">
        <LineClamp @text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
          @seeMoreText="Read More" @seeLessText="Read Less" />
      </div>
    `);

    assert.ok(this.element, 'line clamp target exists');

    assert
      .dom('[data-test-line-clamp-ellipsis]')
      .exists('last line child is the ellipsis element and it exists');

    assert
      .dom('[data-test-line-clamp-show-more]')
      .exists('see more button exists')
      .hasText('Read More', 'see more button contains expected text')
      .doesNotHaveAttribute(
        'aria-label',
        'see more button does not set aria-label by default'
      );

    assert.dom(this.element).containsText('... Read More');

    await click('[data-test-line-clamp-show-more]');

    assert.dom('[data-test-line-clamp-show-more]').doesNotExist();
    assert
      .dom('[data-test-line-clamp-show-less]')
      .exists('see less button exists')
      .hasText('Read Less', 'see less button contains expected text')
      .doesNotHaveAttribute(
        'aria-label',
        'see less button does not set aria-label by default'
      );

    assert.dom(this.element).containsText(' Read Less');
  });

  test('seeMoreA11yText and seeLessA11yText attributes work as expected', async function (assert) {
    assert.expect(11);

    // Render component
    await render(hbs`
      {{!-- template-lint-disable no-inline-styles --}}
      <div style="width: 300px; font-size: 16px; font-family: sans-serif;">
        <LineClamp @text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
          @seeMoreText="Read More" @seeMoreA11yText="A button which expands the content of this text" @seeLessText="Read Less"
          @seeLessA11yText="A button which unexpands the content of this text" />
      </div>
    `);

    assert.ok(this.element, 'line clamp target exists');

    assert
      .dom('[data-test-line-clamp-ellipsis]')
      .exists('last line child is the ellipsis element and it exists');

    assert
      .dom('[data-test-line-clamp-show-more]')
      .exists('see more button exists')
      .hasText('Read More', 'see more button contains expected text')
      .hasAttribute(
        'aria-label',
        'A button which expands the content of this text',
        'see more button sets aria-label if provided'
      );

    assert.dom(this.element).containsText('... Read More');

    await click('[data-test-line-clamp-show-more]');

    assert.dom('[data-test-line-clamp-show-more]').doesNotExist();
    assert
      .dom('[data-test-line-clamp-show-less]')
      .exists('see less button exists')
      .hasText('Read Less', 'see less button contains expected text')
      .hasAttribute(
        'aria-label',
        'A button which unexpands the content of this text',
        'see less button sets aria-label if provided'
      );

    assert.dom(this.element).containsText(' Read Less');
  });

  test('see more button is hidden if text is not long enough to truncate', async function (assert) {
    assert.expect(3);

    // Render component
    await render(hbs`
      {{!-- template-lint-disable no-inline-styles --}}
      <div style="width: 300px; font-size: 16px; font-family: sans-serif;">
        <LineClamp @text="helloworld helloworld" />
      </div>
    `);

    assert.ok(this.element, 'line clamp target exists');

    assert
      .dom('[data-test-line-clamp-show-more]')
      .doesNotExist('see more button is not needed');

    assert.dom(this.element).containsText('helloworld helloworld');
  });

  test('clicking see more button toggles full text', async function (assert) {
    assert.expect(4);

    // Render component
    await render(hbs`
      {{!-- template-lint-disable no-inline-styles --}}
      <div style="width: 300px; font-size: 16px; font-family: sans-serif;">
        <LineClamp @text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld" />
      </div>
    `);

    assert.ok(this.element, 'line clamp target exists');

    assert
      .dom('[data-test-line-clamp-show-more]')
      .exists('see more button exists');

    assert.dom(this.element).containsText('... See More');

    await click('[data-test-line-clamp-show-more]');

    assert
      .dom(this.element)
      .containsText(
        'helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld See Less'
      );
  });

  test('clicking see more/see less button fires user defined action', async function (assert) {
    assert.expect(6);

    this.set('assertOnExpand', function () {
      assert.ok(true, 'onExpand action triggered');
    });
    this.set('assertOnCollapse', function () {
      assert.ok(true, 'onCollapse action triggered');
    });

    // Render component
    await render(hbs`
      {{!-- template-lint-disable no-inline-styles --}}
      <div id="test-container" style="width: 300px; font-size: 16px; font-family: sans-serif;">
        <LineClamp @text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
          @lines={{1}} @onExpand={{this.assertOnExpand}} @onCollapse={{this.assertOnCollapse}} />
      </div>
    `);

    assert.ok(this.element, 'line clamp target exists');

    assert
      .dom('[data-test-line-clamp-show-more]')
      .exists('see more button exists');

    await click('[data-test-line-clamp-show-more]');

    assert
      .dom('[data-test-line-clamp-show-less]')
      .exists('see less button exists');

    await click('[data-test-line-clamp-show-less]');

    assert
      .dom('[data-test-line-clamp-show-more]')
      .exists('see more button exists');
  });

  test('clicking see more/see less buttons should not bubble event', async function (assert) {
    assert.expect(4);

    this.set('assertOnParentClick', () =>
      assert.ok(true, 'parent click action should not be triggered')
    );

    // Render component
    await render(hbs`
      {{!-- template-lint-disable no-inline-styles no-invalid-interactive --}}
      <div id="test-container" style="width: 300px; font-size: 16px; font-family: sans-serif;" {{on 'click'
        this.assertOnParentClick}}>
        <LineClamp @text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld" />
      </div>
    `);

    assert.ok(this.element, 'line clamp target exists');

    assert
      .dom('[data-test-line-clamp-show-more]')
      .exists('see more button exists');

    await click('[data-test-line-clamp-show-more]');

    assert
      .dom('[data-test-line-clamp-show-less]')
      .exists('see less button exists');

    await click('[data-test-line-clamp-show-less]');

    assert
      .dom('[data-test-line-clamp-show-more]')
      .exists('see more button exists');
  });

  test("changing the component's text changes the component", async function (assert) {
    assert.expect(2);

    this.set(
      'textToTruncate',
      'helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld'
    );

    // Render component
    await render(hbs`
      {{!-- template-lint-disable no-inline-styles --}}
      <div id="test-container" style="width: 300px; font-size: 16px; font-family: sans-serif;">
        <LineClamp @text={{this.textToTruncate}} />
      </div>
    `);

    assert
      .dom('[data-test-line-clamp-show-more]')
      .exists('see more button exists');

    this.set('textToTruncate', 'helloworld helloworld helloworld helloworld');

    assert
      .dom('[data-test-line-clamp-show-more]')
      .doesNotExist('see more button exists');
  });

  test("changing the component's lines changes the component", async function (assert) {
    assert.expect(4);

    this.set(
      'textToTruncate',
      'helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld'
    );
    this.set('linesToTruncate', 3);

    // Render component
    await render(hbs`
      {{!-- template-lint-disable no-inline-styles --}}
      <div id="test-container" style="width: 300px; font-size: 16px; font-family: sans-serif;">
        <LineClamp @text={{this.textToTruncate}} @lines={{this.linesToTruncate}} />
      </div>
    `);

    assert.dom('[data-test-line-clamp-line]').exists({ count: 3 });
    assert
      .dom('[data-test-line-clamp-show-more]')
      .exists('see more button exists');

    this.set('linesToTruncate', 2);

    assert.dom('[data-test-line-clamp-line]').exists({ count: 2 });
    assert
      .dom('[data-test-line-clamp-show-more]')
      .exists('see more button exists');
  });

  test('truncation can be controlled via the truncate attribute', async function (assert) {
    assert.expect(3);

    this.set(
      'textToTruncate',
      'helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld'
    );
    this.set('truncate', true);

    // Render component
    await render(hbs`
      {{!-- template-lint-disable no-inline-styles --}}
      <div id="test-container" style="width: 300px; font-size: 16px; font-family: sans-serif;">
        <LineClamp @text={{this.textToTruncate}} @truncate={{this.truncate}} />
      </div>
    `);

    assert
      .dom('[data-test-line-clamp-show-more]')
      .exists('see more button exists');

    this.set('truncate', false);

    assert
      .dom('[data-test-line-clamp-show-less]')
      .exists('see less button exists');

    this.set('truncate', true);

    assert
      .dom('[data-test-line-clamp-show-more]')
      .exists('see more button exists');
  });

  test('initial truncation can be controlled via the truncate attribute (false case)', async function (assert) {
    assert.expect(3);

    this.set(
      'textToTruncate',
      'helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld'
    );
    this.set('truncate', false);

    // Render component
    await render(hbs`
      {{!-- template-lint-disable no-inline-styles --}}
      <div id="test-container" style="width: 300px; font-size: 16px; font-family: sans-serif;">
        <LineClamp @text={{this.textToTruncate}} @truncate={{this.truncate}} />
      </div>
    `);

    assert
      .dom('[data-test-line-clamp-show-less]')
      .exists('see less button exists');

    this.set('truncate', true);

    assert
      .dom('[data-test-line-clamp-show-more]')
      .exists('see more button exists');

    this.set('truncate', false);

    assert
      .dom('[data-test-line-clamp-show-less]')
      .exists('see less button exists');
  });

  test('stripText correctly strips <br> tags', async function (assert) {
    assert.expect(2);

    this.set(
      'textToTruncate',
      htmlSafe('helloworld<br />helloworld<br />helloworld<br />helloworld')
    );
    this.set('truncate', true);
    this.set('stripText', true);

    // Render component
    await render(hbs`
      {{!-- template-lint-disable no-inline-styles --}}
      <div id="test-container" style="width: 300px; font-size: 16px; font-family: sans-serif;">
        <LineClamp @text={{this.textToTruncate}} @truncate={{this.truncate}} @stripText={{this.stripText}} />
      </div>
    `);

    assert.strictEqual(
      this.element.innerText.trim(),
      'helloworld helloworld helloworld helloworld'
    );

    this.set('truncate', false);

    assert.strictEqual(
      this.element.innerText.trim(),
      `helloworld\nhelloworld\nhelloworld\nhelloworld See Less`
    );
  });

  test('stripText correctly strips preserves newlines when stripText is false', async function (assert) {
    assert.expect(2);

    this.set(
      'textToTruncate',
      htmlSafe('helloworld<br />helloworld<br />helloworld<br />helloworld')
    );
    this.set('truncate', true);
    this.set('stripText', false);

    // Render component
    await render(hbs`
      {{!-- template-lint-disable no-inline-styles --}}
      <div id="test-container" style="width: 300px; font-size: 16px; font-family: sans-serif;">
        <LineClamp @text={{this.textToTruncate}} @truncate={{this.truncate}} @stripText={{this.stripText}} />
      </div>
    `);

    const element = this.element;
    assert.dom(element).containsText('... See More');

    this.set('truncate', false);

    assert.strictEqual(
      element.innerText.trim(),
      'helloworld\nhelloworld\nhelloworld\nhelloworld See Less'
    );
  });

  test('null/undefined text handled correctly', async function (assert) {
    assert.expect(2);

    this.set('textToTruncate', null);
    this.set('truncate', true);

    // Render component
    await render(
      hbs`<LineClamp @text={{this.textToTruncate}} @truncate={{this.truncate}} />`
    );

    const element = this.element;
    assert.strictEqual(element.innerText.trim(), '');

    this.set('textToTruncate', undefined);

    assert.strictEqual(element.innerText.trim(), '');
  });

  test('[A11y] aria-expanded is correct', async function (assert) {
    assert.expect(3);

    // Render component
    await render(hbs`
      {{!-- template-lint-disable no-inline-styles --}}
      <div style="width: 300px; font-size: 16px; font-family: sans-serif;">
        <LineClamp @text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
          @lines={{1}} />
      </div>
    `);

    assert
      .dom('[data-test-line-clamp-show-more]')
      .hasAttribute('aria-expanded', 'false');

    await click('[data-test-line-clamp-show-more]');

    assert
      .dom('[data-test-line-clamp-show-less]')
      .hasAttribute('aria-expanded', 'true');

    await click('[data-test-line-clamp-show-less]');

    assert
      .dom('[data-test-line-clamp-show-more]')
      .hasAttribute('aria-expanded', 'false');
  });

  test('[A11y] button is correctly focused after expanding/collapsing', async function (assert) {
    assert.expect(2);

    // Render component
    await render(hbs`
      {{!-- template-lint-disable no-inline-styles --}}
      <div style="width: 300px; font-size: 16px; font-family: sans-serif;">
        <LineClamp @text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
          @lines={{1}} />
      </div>
    `);

    await click('[data-test-line-clamp-show-more]');

    assert
      .dom('[data-test-line-clamp-show-less]')
      .isFocused('show less button is focused');

    await click('[data-test-line-clamp-show-less]');

    assert
      .dom('[data-test-line-clamp-show-more]')
      .isFocused('show more button is focused');
  });

  skip('resizing triggers component to re-truncate', async function (assert) {
    assert.expect(4);
    const done = assert.async();

    // Render component
    await render(hbs`
      {{!-- template-lint-disable no-inline-styles --}}
      <div id="test-container" style="width: 300px; font-size: 16px; font-family: sans-serif;">
        <LineClamp @text="helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld"
          @seeMoreText="Read More" @seeMoreA11yText="A button which expands the content of this text" @seeLessText="Read Less"
          @seeLessA11yText="A button which unexpands the content of this text" />
      </div>
    `);

    const element = this.element;
    const seeMoreButtonBeforeResize = element.querySelectorAll(
      '.lt-line-clamp__line .lt-line-clamp__more'
    );

    assert.ok(element, 'line clamp target exists');

    assert.strictEqual(
      seeMoreButtonBeforeResize.length,
      1,
      'see more button exists'
    );

    assert.dom(element).containsText('... See More');

    // Mimic window resize
    element.querySelector('#test-container').style.width = '960px';
    window.dispatchEvent(new CustomEvent('resize'));

    setTimeout(() => {
      const seeMoreButtonAfterResize = element.querySelectorAll(
        '.lt-line-clamp__line .lt-line-clamp__more'
      );

      assert.strictEqual(
        seeMoreButtonAfterResize.length,
        0,
        'see more button does not exist'
      );

      done();
    }, 10);
    // const seeMoreButtonAfterResize = element.querySelectorAll('.lt-line-clamp__line .lt-line-clamp__more');

    // assert.strictEqual(
    //   seeMoreButtonAfterResize.length,
    //   0,
    //   'see more button does not exist'
    // );

    // assert.strictEqual(
    //   element.innerText.trim(),
    //   'helloworld helloworld helloworld helloworld helloworld helloworld helloworld helloworld'
    // );
  });
});
