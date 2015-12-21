'use strict';

;(function (doc) {

  'use strict';

  var TOOLTIP_SIMPLE = 'js-simple-tooltip';
  var TOOLTIP_SIMPLE_CONTAINER = 'simpletooltip_container';
  var TOOLTIP_SIMPLE_RAW = 'simpletooltip';
  var TOOLTIP_SIMPLE_LABEL_ID = 'label_simpletooltip_';

  var findById = function findById(id) {
    return doc.getElementById(id);
  };

  // Find all tooltips (convert a NodeList to an array)
  var $listTooltip = [].slice.call(doc.querySelectorAll('.' + TOOLTIP_SIMPLE));

  /**
   * Wrap a node inside a span tooltip container
   * @param  {Node} node
   * @param  {String} prefixClass prefix classname
   * @return {Node} the wrapper node
   */
  var wrapItem = function wrapItem(node, prefixClass) {
    // Join classNames
    // filter(Boolean) -> remove undefined or empty string. prefixClass can be empty.
    // We do not want to create 'undefined-xxx' nor '-xxx' but xxx
    var className = [prefixClass, TOOLTIP_SIMPLE_CONTAINER].filter(Boolean).join('-');
    var wrapper = doc.createElement('SPAN');
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
  var createTooltip = function createTooltip(config) {

    var id = TOOLTIP_SIMPLE_LABEL_ID + config.index;
    var className = [config.className, TOOLTIP_SIMPLE_RAW].filter(Boolean).join('-');

    var content = config.text;

    // If there is no content but an id we try to fetch dat content id
    if (!content && config.id) {
      var contentFromId = findById(config.id);

      if (contentFromId) {
        content = contentFromId.innerHTML;
      }
    }

    return '<span\n      class="' + className + ' ' + TOOLTIP_SIMPLE + '"\n      id="' + id + '"\n      role="tooltip"\n      aria-hidden="true">' + content + '</span>';
  };

  $listTooltip.forEach(function (node, index) {

    var iLisible = index + 1;
    var text = node.dataset.simpletooltipText || '';
    var prefixClassName = node.dataset.simpletooltipPrefixClass || '';
    var contentId = node.dataset.simpletooltipContentId;

    // Attach the tooltip position
    node.setAttribute('aria-describedby', 'label_simpletooltip_' + iLisible);

    wrapItem(node, prefixClassName).insertAdjacentHTML('beforeEnd', createTooltip({
      text: text,
      index: iLisible,
      className: prefixClassName,
      id: contentId
    }));
  });

  // Display the tooltip
  ['mouseenter', 'focus'].forEach(function (eventName) {

    doc.body.addEventListener(eventName, function (e) {

      if (e.target.classList.contains(TOOLTIP_SIMPLE)) {
        var item = findById(e.target.getAttribute('aria-describedby'));
        item && item.setAttribute('aria-hidden', 'false');
      }
    }, true);
  });

  // Hide the tooltip
  ['mouseleave', 'blur', 'keydown'].forEach(function (eventName) {

    doc.body.addEventListener(eventName, function (e) {

      if (e.target.classList.contains(TOOLTIP_SIMPLE)) {
        var item = findById(e.target.getAttribute('aria-describedby'));

        if (item)
          // Hide it if !keydown
          'keydown' !== e.type && item.setAttribute('aria-hidden', 'true');

        // Hide the item only when we press ESC
        'keydown' === e.type && 27 === e.keyCode && item.setAttribute('aria-hidden', 'true');
      }
    }, true);
  });
})(document);