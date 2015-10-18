;(doc => {

  'use strict';

  const TOOLTIP_SIMPLE = 'js-simple-tooltip';
  const TOOLTIP_SIMPLE_CONTAINER = 'simpletooltip_container';
  const TOOLTIP_SIMPLE_RAW = 'simpletooltip';
  const TOOLTIP_SIMPLE_LABEL_ID = 'label_simpletooltip_';

  const findById = id => doc.getElementById(id);

  // Find all tooltips
  const $listTooltip = doc.querySelectorAll('.' + TOOLTIP_SIMPLE);

  /**
   * Wrap a node inside a span tooltip container
   * @param  {Node} node
   * @param  {String} prefixClass prefix classname
   * @return {Node} the wrapper node
   */
  const wrapItem = (node, prefixClass) => {
    const className = [prefixClass, TOOLTIP_SIMPLE_CONTAINER].filter(Boolean).join('-');
    let wrapper = doc.createElement('SPAN');
    wrapper.classList.add(className);
    node.parentNode.insertBefore(wrapper, node);
    wrapper.appendChild(node);
    return wrapper;
  };

  /**
   * Create the template for a tooltip
   * @param  {Object} config
   * @return {String}
   */
  const createTooltip = config => {

    const id = TOOLTIP_SIMPLE_LABEL_ID + config.index;
    const className = [config.className, TOOLTIP_SIMPLE_RAW].filter(Boolean).join('-');

    let content = config.text;

    // If there is no content but an id we try to fetch dat content id
    if(!content && config.id) {
      const contentFromId = findById(config.id);

      if(contentFromId) {
        content = contentFromId.innerHTML;
      }
    }

    return `<span
      class="${className} ${TOOLTIP_SIMPLE}"
      id="${id}"
      role="tooltip"
      aria-hidden="true">${content}</span>`;
  };

  Array
    .from($listTooltip)
    .forEach((node, index) => {

      let iLisible = index + 1;
      let text = node.dataset.simpletooltipText || '';
      let prefixClassName = node.dataset.simpletooltipPrefixClass || '';
      let contentId = node.dataset.simpletooltipContentId;

      // Attach the tooltip position
      node.setAttribute('aria-describedby', 'label_simpletooltip_' + iLisible);

      wrapItem(node, prefixClassName)
        .insertAdjacentHTML('beforeEnd', createTooltip({
          text: text,
          index: iLisible,
          className: prefixClassName,
          id: contentId
        }));
    });

    // Display the tooltip
    ['mouseenter', 'focusin']
      .forEach(eventName => {

        doc.body
          .addEventListener(eventName, e => {

            if(e.target.classList.contains(TOOLTIP_SIMPLE)) {
              let item = findById(e.target.getAttribute('aria-describedby'));
              item && item.setAttribute('aria-hidden', 'false');
            }

          }, true);
      });

    // Hide the tooltip
    ['mouseleave', 'focusout', 'keydown']
      .forEach(eventName => {

        doc.body
          .addEventListener(eventName, e => {

            if(e.target.classList.contains(TOOLTIP_SIMPLE)) {
              let item = findById(e.target.getAttribute('aria-describedby'));

              if(item)
                // Hide it if !keydown
                'keydown' !== e.type && item.setAttribute('aria-hidden', 'true');

                // Hide the item only when we press ESC
                ('keydown' === e.type && 27 === e.keyCode) && item.setAttribute('aria-hidden', 'true')

            }

          }, true);
      });

})(document);