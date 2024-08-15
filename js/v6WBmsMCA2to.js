/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./assets/_src/js/blog/ds_blog-filter.js":
/*!***********************************************!*\
  !*** ./assets/_src/js/blog/ds_blog-filter.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ds_loadMoreBlog": function() { return /* binding */ ds_loadMoreBlog; }
/* harmony export */ });
/* provided dependency */ var jQuery = __webpack_require__(/*! jquery */ "jquery");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "jquery");
var ds_loadMoreBlog = function ds_loadMoreBlog() {
  (function ($) {
    // jQuery(document).on('init_filter', (e, module) => {
    //     DSInitFilter(module);
    // });

    var DSInitFilter = function DSInitFilter(module) {
      var filter = {
        module: null,
        action: null,
        form: '',
        moreBtn: $(),
        results: null,
        doing_ajax: null,
        timeout: null,
        query: {
          post_type: null,
          per_page: 9,
          page: 1,
          main_taxonomy: null,
          content_type: null,
          region: null,
          language: null,
          search: null
        },
        component_styles: {},
        ajax_url: ds.ajax_url,
        preloader: '<div class="filter-loader loader"><div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div><div class="loader-bg"></div></div>',
        init: function init(module) {
          var ajaxModule = $(module);
          if (ajaxModule) {
            filter.module = ajaxModule;
            filter.action = ajaxModule.data('action');
            filter.query.post_type = ajaxModule.data('post-type');
            filter.query.posts_per_page = ajaxModule.data('per-page');
            filter.query.main_taxonomy = ajaxModule.data('main-taxonomy');
            filter.query.content_type = ajaxModule.data('content-type');
            filter.query.region = ajaxModule.data('region');
            filter.query.language = ajaxModule.data('language');
            if (document.URL.indexOf('?') > 0) {
              var params = new URLSearchParams(window.location.search);
              filter.query.search = params.get('s');
            }
            filter.initElementsActions();
          }
        },
        initElementsActions: function initElementsActions() {
          var results = filter.module.find('div[data-container="ajax-result"]');
          if (results) {
            filter.results = results;
            var moreBtn = filter.module.find('.ajax-load-more');
            if (moreBtn) {
              filter.moreBtn = moreBtn;
              filter.morePosts();
            }
            var form = filter.module.find('form[data-form="ajax"]');
            if (form) {
              filter.form = form;
              filter.changeForm();
            }
          }
          var compClass = filter.module.data('class');
          if (compClass) {
            filter.component_styles.class = compClass;
          }
          var compStyles = filter.module.data('styles');
          if (compStyles) {
            filter.component_styles.styles = compStyles;
          }
          var compImage = filter.module.data('image');
          if (compImage) {
            filter.component_styles.image = compImage;
          }
        },
        morePosts: function morePosts() {
          filter.moreBtn.on('click', function (e) {
            e.preventDefault();
            filter.sendAjax(filter.query.page, false);
          });
        },
        changeForm: function changeForm() {
          var $input_text = filter.form.find('input[type="text"], textarea');
          $input_text.unbind('keyup');
          $input_text.not('[data-ajax="false"]').keyup(function (e) {
            if (e.keyCode === 13) {
              return;
            }
            if (filter.timeout != null) {
              clearTimeout(filter.timeout);
            }
            filter.timeout = setTimeout(function () {
              filter.timeout = null;
              filter.sendAjax();
              $input_submit.parent().addClass('is-filter-active');
            }, 500);
          });
          var $input_submit = filter.form.find('button[type="submit"]');
          $input_submit.unbind('click');
          $input_submit.not('[data-ajax="false"]').click(function (e) {
            e.preventDefault();
            filter.sendAjax();
            $input_submit.parent().addClass('is-filter-active');
          });
          var $select = filter.form.find('select');
          $select.unbind('change');
          $select.not('[data-ajax="false"]').change(function () {
            filter.sendAjax();
          });
          $select.filter('[data-target="input"]').change(function (e) {
            var $currentItem = $(e.target);
            var $inputTarget = filter.form.find("input.".concat($currentItem.data('target-name')));
            if ($inputTarget) {
              var $selectedOption = $currentItem.find('option:selected');
              $inputTarget.val($selectedOption.val());
              $inputTarget.data('push-url', $selectedOption.data('term-url'));
              filter.sendAjax();
            }
          });
          $select.filter('[data-target="ul"]').change(function (e) {
            var $currentItem = $(e.target);
            filter.form.find("ul.".concat($currentItem.data('target-name'))).find("li a[data-term-slug=\"".concat($currentItem.find('option:selected').val(), "\"]")).trigger('click');
            ;
            filter.sendAjax();
          });
          var $list = filter.form.find('ul[data-ajax-push-url="true"]').first();
          $list.unbind('change');
          $list.find('li a').click(function (e) {
            e.preventDefault();
            $list.find('li a').removeClass('active_term');
            var $activeTerm = $(e.target);
            $activeTerm.addClass('active_term');
            var $inputTarget = filter.form.find("input.".concat($list.data('target-name')));
            if ($inputTarget) {
              var _filter$form$find;
              $inputTarget.val($activeTerm.data('term-slug'));
              $inputTarget.data('push-url', $activeTerm.attr('href'));
              (_filter$form$find = filter.form.find("select.".concat($list.data('target-name'), " option[value=\"").concat($activeTerm.data('term-slug'), "\"]"))) === null || _filter$form$find === void 0 ? void 0 : _filter$form$find.prop('selected', true);
              filter.sendAjax();
            }
          });
          filter.form.unbind('keydown');
          filter.form.on('ds_trigger_browser_button_used', function (event) {
            event.preventDefault();
            filter.sendAjax(0, false);
          });
        },
        sendAjax: function sendAjax() {
          var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var push_state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
          if (filter.doing_ajax != null) {
            filter.doing_ajax.abort();
            filter.doing_ajax = null;
            filter.module.find('.loader').remove();
          }
          var data = {
            action: filter.action,
            query: {
              post_type: filter.query.post_type,
              posts_per_page: filter.query.posts_per_page,
              paged: page
            },
            main_taxonomy: filter.query.main_taxonomy,
            content_type: filter.query.content_type,
            region: filter.query.region,
            language: filter.query.language,
            s: filter.query.search,
            component: filter.component_styles,
            device: $(window).width() <= 768 ? 'mobile' : 'desktop'
          };
          if (filter.form.length > 0) {
            data.form = filter.form.serialize();
          }
          filter.doing_ajax = $.ajax({
            url: filter.ajax_url,
            type: 'POST',
            data: data,
            beforeSend: function beforeSend(xhr) {
              filter.module.append(filter.preloader);
              if (push_state) {
                filter.build_url(data.query.paged, push_state);
              }
            },
            success: function success(data) {
              if (data) {
                if (data.page === 1) filter.results.html('');
                filter.results.append(data.posts);
                if (data.max_pages === data.page) {
                  filter.moreBtn.hide();
                } else {
                  filter.moreBtn.show();
                }
                if (data.total_posts_showing === 0) {
                  filter.module.find('.js-blog-counter-wrapper').hide();
                } else {
                  filter.module.find('.js-blog-counter-wrapper').show();
                }
                if (data.total_posts_showing) {
                  filter.module.find('.js-blog-counter-showing').text(data.total_posts_showing);
                }
                if (data.total_posts) {
                  filter.module.find('.js-blog-counter-total').text(data.total_posts);
                }
                filter.query.page = data.page;
                filter.moreBtn.attr('data-page', data.page);
                filter.module.find('.loader').remove();
              } else {
                filter.moreBtn.hide();
              }
              filter.doing_ajax = null;
            }
          });
        },
        build_url: function build_url(paged) {
          var _filter$form$find$fir;
          var url_parse_side = window.location.href.split("?");
          var url = new URL(url_parse_side[0]);
          var oldUrl = new URL(window.history.state && window.history.state.path ? window.history.state.path : window.location.href);
          var push_state = false;
          var inputPushUrl = (_filter$form$find$fir = filter.form.find('input[data-push-url]').first().data('push-url')) !== null && _filter$form$find$fir !== void 0 ? _filter$form$find$fir : '';
          if (inputPushUrl !== '') {
            push_state = true;
            url.href = inputPushUrl;
          }
          filter.form.find('input[type=text]:not([data-ajax="false"])').each(function () {
            push_state = true;
            if (jQuery(this).val().length > 0) {
              url.searchParams.set(jQuery(this).attr('name'), jQuery(this).val());
            }
          });
          filter.form.find('select:not([data-ajax="false"])').each(function () {
            push_state = true;
            if (jQuery(this).find('option:selected').val().length > 0) {
              url.searchParams.set(jQuery(this).attr('name'), jQuery(this).find('option:selected').val());
            }
          });
          var decoded_url = decodeURIComponent(url);
          if (push_state && (oldUrl.searchParams.toString() !== url.searchParams.toString() || oldUrl.href !== url.href)) {
            window.history.pushState({
              'path': decoded_url,
              'ds_trigger_filter': true
            }, null, decoded_url);
          }
        }
      };
      filter.init(module);
    };
    var doInit = function doInit() {
      $('.js-ajax-block').each(function (i) {
        DSInitFilter($('.js-ajax-block')[i]);
      });
    };
    doInit();
    addEventListener('popstate', function (event) {
      $('.js-ajax-block').each(function (i, item) {
        reInitFilter(item);
      });
    });
  })(jQuery);
};
var reInitFilter = function reInitFilter(filter) {
  var parsedUrl = window.location.href.split("?");
  var currentUrl = new URL(window.location.href.toString());
  var cleanedUrl = new URL(parsedUrl[0]);
  var params = currentUrl.searchParams;
  var triggerChange = false;
  var form = $(filter).find('form[data-form="ajax"]');
  form.find('input[type=text]:not([data-ajax="false"])').each(function (index, elem) {
    var _params$get;
    var $this = $(elem);
    $this.val((_params$get = params.get($this.attr('name'))) !== null && _params$get !== void 0 ? _params$get : '');
    triggerChange = true;
  });
  form.find('select:not([data-ajax="false"])').each(function (index, elem) {
    var _params$get2;
    var $this = $(elem);
    var value = (_params$get2 = params.get($this.attr('name'))) !== null && _params$get2 !== void 0 ? _params$get2 : '';
    if (value !== '') {
      $this.find("option[value=".concat(value, "]")).prop('selected', true);
    } else {
      $this.find('option:eq(0)').prop('selected', true);
    }
    triggerChange = true;
  });
  form.find('ul[data-ajax-push-url="true"]:first li a').each(function (index, elem) {
    var $this = $(elem);
    if ($this.attr('href') === cleanedUrl.href && !$this.hasClass('active_term')) {
      $this.trigger('click');
      triggerChange = true;
    }
  });
  form.find('select[data-target="input"]').each(function (index, elem) {
    var $this = $(elem);
    var selectedOption = $this.find('option:selected');
    var $inputTarget = form.find("input.".concat($this.data('target-name')));
    if (selectedOption.data('term-url') !== cleanedUrl.href) {
      $this.find("option[data-term-url=\"".concat(cleanedUrl.href, "\"]")).prop('selected', true);
      var $newSelectedOption = $this.find('option:selected');
      $inputTarget.val($newSelectedOption.val());
      $inputTarget.data('push-url', $newSelectedOption.data('term-url'));
      triggerChange = true;
    }
  });
  if (triggerChange) {
    form.trigger('ds_trigger_browser_button_used');
  }
};


/***/ }),

/***/ "./assets/_src/js/components/correctClipPath.js":
/*!******************************************************!*\
  !*** ./assets/_src/js/components/correctClipPath.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "correctClipPath": function() { return /* binding */ correctClipPath; }
/* harmony export */ });
function correctClipPath() {
  window.onload = function () {
    var baseHeight = 473;
    // var baseWidth = baseHeight * 0.345;
    var baseWidth = baseHeight * 0.345 * 2.25;
    var images = document.querySelectorAll('.m-block.absolute-media .c-image__media.c-image__primary > img');
    images.forEach(function (img) {
      setClipPath(img, baseWidth, baseHeight);
    });
    window.onresize = function () {
      images.forEach(function (img) {
        setClipPath(img, baseWidth, baseHeight);
      });
    };
  };
  function setClipPath(img, baseWidth, baseHeight) {
    var imageHeight = img.clientHeight;
    var proportionalWidth = baseWidth / baseHeight * imageHeight;
    var clipPathValue = proportionalWidth / img.clientWidth * 100 + '% 0%, 100% 0%, 100% 100%, 0% 100%';
    img.style.clipPath = 'polygon(' + clipPathValue + ')';
  }
}

/***/ }),

/***/ "./assets/_src/js/function-calls/3d-media/image-spinner.js":
/*!*****************************************************************!*\
  !*** ./assets/_src/js/function-calls/3d-media/image-spinner.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "callImageSpinners": function() { return /* binding */ callImageSpinners; }
/* harmony export */ });
/* harmony import */ var _library_3d_media_spinner_plugins_ctrl_playback_plugin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../library/3d-media/spinner-plugins/ctrl-playback-plugin */ "./assets/_src/js/library/3d-media/spinner-plugins/ctrl-playback-plugin.js");
/* harmony import */ var _library_3d_media_spinner_plugins_ctrl_frames_nav_plugin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../library/3d-media/spinner-plugins/ctrl-frames-nav-plugin */ "./assets/_src/js/library/3d-media/spinner-plugins/ctrl-frames-nav-plugin.js");
/* harmony import */ var _library_3d_media_spinner_plugins_ctrl_zoom_plugin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../library/3d-media/spinner-plugins/ctrl-zoom-plugin */ "./assets/_src/js/library/3d-media/spinner-plugins/ctrl-zoom-plugin.js");
/* harmony import */ var _library_3d_media_spinner_plugins_ctrl_fullscreen_plugin__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../library/3d-media/spinner-plugins/ctrl-fullscreen-plugin */ "./assets/_src/js/library/3d-media/spinner-plugins/ctrl-fullscreen-plugin.js");
/* harmony import */ var _library_3d_media_spinner_plugins_progress_fraction_plugin__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../library/3d-media/spinner-plugins/progress-fraction-plugin */ "./assets/_src/js/library/3d-media/spinner-plugins/progress-fraction-plugin.js");
/* harmony import */ var _library_3d_media_spinner_plugins_hotspots_plugin__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../library/3d-media/spinner-plugins/hotspots-plugin */ "./assets/_src/js/library/3d-media/spinner-plugins/hotspots-plugin.js");
/* harmony import */ var _library_3d_media_spinner_plugins_ctrl_drag_plugin__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../library/3d-media/spinner-plugins/ctrl-drag-plugin */ "./assets/_src/js/library/3d-media/spinner-plugins/ctrl-drag-plugin.js");
/* harmony import */ var _library_3d_media_spinner_controls_playback__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../library/3d-media/spinner-controls/playback */ "./assets/_src/js/library/3d-media/spinner-controls/playback.js");
/* harmony import */ var _library_3d_media_spinner_controls_frames_nav__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../library/3d-media/spinner-controls/frames-nav */ "./assets/_src/js/library/3d-media/spinner-controls/frames-nav.js");
/* harmony import */ var _library_3d_media_spinner_controls_zoom__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../library/3d-media/spinner-controls/zoom */ "./assets/_src/js/library/3d-media/spinner-controls/zoom.js");
/* harmony import */ var _library_3d_media_spinner_controls_fullscreen__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../library/3d-media/spinner-controls/fullscreen */ "./assets/_src/js/library/3d-media/spinner-controls/fullscreen.js");
/* harmony import */ var _library_3d_media_spinner_controls_progress_fraction__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../library/3d-media/spinner-controls/progress-fraction */ "./assets/_src/js/library/3d-media/spinner-controls/progress-fraction.js");
/* harmony import */ var _library_3d_media_spinner_controls_autoanimate__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../library/3d-media/spinner-controls/autoanimate */ "./assets/_src/js/library/3d-media/spinner-controls/autoanimate.js");
/* harmony import */ var _library_3d_media_spinner_controls_hotspots_nav__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../library/3d-media/spinner-controls/hotspots-nav */ "./assets/_src/js/library/3d-media/spinner-controls/hotspots-nav.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "jquery");
/**
 * Simple Image Spinner
 */















// config selectors
var spinnerElemName = 'js-image-spinner';
var spinnerModuleWrap = '.m-image-spinner';

// get all spinners
var spinnerModuleList = document.querySelectorAll(spinnerModuleWrap);
var callImageSpinners = function callImageSpinners() {
  if (!spinnerModuleList.length) {
    return;
  }
  var spinnerOptions = [];

  // loop through spinners and assign them IDs
  spinnerModuleList.forEach(function (spinnerModule, i) {
    var imgSpinnerElem = spinnerModule.querySelector('.js-image-spinner');
    var imgPath = spinnerModule.getAttribute('data-spinner-path');
    var imgPrefix = spinnerModule.getAttribute('data-spinner-prefix');
    var imgDigits = spinnerModule.getAttribute('data-spinner-digits');
    var imgCount = spinnerModule.getAttribute('data-spinner-count');
    var imgExt = spinnerModule.getAttribute('data-spinner-ext');
    if (!(imgPath || imgPrefix || imgDigits || imgCount || imgExt)) {
      return;
    }
    var spinnerID = "".concat(spinnerElemName, "-").concat(i);
    imgSpinnerElem.setAttribute('id', spinnerID);
    spinnerOptions[i] = {
      source: SpriteSpin.sourceArray(imgPath + '/' + imgPrefix + '{frame}.' + imgExt, {
        frame: [1, imgCount],
        digits: imgDigits
      }),
      // use double click to in/out (default is true)
      zoomUseClick: true,
      // prevents changing the frame during zoom (default is true)
      zoomPinFrame: false,
      sense: -1,
      responsive: true,
      animate: false,
      sizeMode: 'fit',
      renderer: 'canvas',
      preloadCount: 2,
      // animation speed
      frameTime: 120,
      playToFrameTime: 10,
      reverse: false,
      // Make sure to use the same value for forceReverse, in case it gets changed by 'nearest' frame hs option
      forceReverse: false,
      plugins: ['360' // display plugin
      //    'drag', // interaction plugin - optional per module settings
      // native zoom plugin is triggered via dsZoomControl
      //    'zoom',
      ]
    };

    // plugins
    spinnerOptions[i] = (0,_library_3d_media_spinner_controls_progress_fraction__WEBPACK_IMPORTED_MODULE_11__.isFractionOn)(spinnerModule, spinnerOptions[i]);
    spinnerOptions[i] = (0,_library_3d_media_spinner_controls_frames_nav__WEBPACK_IMPORTED_MODULE_8__.isFramesNavOn)(spinnerModule, spinnerOptions[i]);
    spinnerOptions[i] = (0,_library_3d_media_spinner_controls_zoom__WEBPACK_IMPORTED_MODULE_9__.isZoomOn)(spinnerModule, spinnerOptions[i]);
    spinnerOptions[i] = (0,_library_3d_media_spinner_controls_fullscreen__WEBPACK_IMPORTED_MODULE_10__.isFullScreenOn)(spinnerModule, spinnerOptions[i]);
    spinnerOptions[i] = (0,_library_3d_media_spinner_controls_playback__WEBPACK_IMPORTED_MODULE_7__.isPlaybackOn)(spinnerModule, spinnerOptions[i]);
    spinnerOptions[i] = (0,_library_3d_media_spinner_controls_hotspots_nav__WEBPACK_IMPORTED_MODULE_13__.isHotspotsOn)(spinnerModule, spinnerOptions[i]);
    spinnerOptions[i] = (0,_library_3d_media_spinner_plugins_ctrl_drag_plugin__WEBPACK_IMPORTED_MODULE_6__.isDragOn)(spinnerModule, spinnerOptions[i]);

    // other options
    spinnerOptions[i] = (0,_library_3d_media_spinner_controls_autoanimate__WEBPACK_IMPORTED_MODULE_12__.isAnimateOn)(spinnerModule, spinnerOptions[i]);
    bootImageSpinner("#".concat(spinnerID), spinnerOptions[i]);
  });
  (0,_library_3d_media_spinner_plugins_ctrl_playback_plugin__WEBPACK_IMPORTED_MODULE_0__.registerPlaybackControlPlugin)('dsPlaybackControl');
  (0,_library_3d_media_spinner_plugins_ctrl_frames_nav_plugin__WEBPACK_IMPORTED_MODULE_1__.registerFramesNavControlPlugin)('dsFramesNavControl');
  (0,_library_3d_media_spinner_plugins_ctrl_zoom_plugin__WEBPACK_IMPORTED_MODULE_2__.registerZoomControlPlugin)('dsZoomControl');
  (0,_library_3d_media_spinner_plugins_ctrl_fullscreen_plugin__WEBPACK_IMPORTED_MODULE_3__.registerFullscrControlPlugin)('dsFullScreenControl');
  (0,_library_3d_media_spinner_plugins_progress_fraction_plugin__WEBPACK_IMPORTED_MODULE_4__.registerProgressFractionPlugin)('dsProgressFraction');
  (0,_library_3d_media_spinner_plugins_hotspots_plugin__WEBPACK_IMPORTED_MODULE_5__.registerHotSpotsPlugin)('dsHotSpots');
};
function bootImageSpinner(selector, options) {
  if ("IntersectionObserver" in window) {
    // Browser supports IntersectionObserver so use that to defer the boot
    var observer = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          observer.unobserve(entry.target);
          $(entry.target).spritespin(options);
        }
      });
    });
    observer.observe($(selector)[0]);
  } else {
    // Browser does not support IntersectionObserver so boot instantly
    $(selector).spritespin(options);
    //   console.log("spinner booted by default", selector, options);
  }
}



/***/ }),

/***/ "./assets/_src/js/function-calls/accordions.js":
/*!*****************************************************!*\
  !*** ./assets/_src/js/function-calls/accordions.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "callAccordions": function() { return /* binding */ callAccordions; }
/* harmony export */ });
/* harmony import */ var _accordions_accordions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./accordions/accordions */ "./assets/_src/js/function-calls/accordions/accordions.js");

var callAccordions = function callAccordions() {
  (0,_accordions_accordions__WEBPACK_IMPORTED_MODULE_0__.createAccordions)();
};


/***/ }),

/***/ "./assets/_src/js/function-calls/accordions/accordions.js":
/*!****************************************************************!*\
  !*** ./assets/_src/js/function-calls/accordions/accordions.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createAccordions": function() { return /* binding */ createAccordions; }
/* harmony export */ });
/* harmony import */ var _library_tabs_accordions_DSMPAccordions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../library/tabs-accordions/DSMPAccordions */ "./assets/_src/js/library/tabs-accordions/DSMPAccordions.js");

var accordionID = 'js-acc';
var accordionSelector = '.js-acc-wrapper';
var accordionItems = document.querySelectorAll(accordionSelector);
var createAccordions = function createAccordions() {
  var accordions = [];
  accordionItems.forEach(function (acc, i) {
    var accID = "".concat(accordionID, "-").concat(i);
    var callID = "#".concat(accID);
    acc.setAttribute('id', accID);
    accordions[i] = new _library_tabs_accordions_DSMPAccordions__WEBPACK_IMPORTED_MODULE_0__["default"](callID);

    //Uncomment if an event is needed to re init accordions, ex: when using load more for faqs
    // acc.addEventListener('re-init', event => {
    //     accordions[i].reInit();
    // })
  });
};



/***/ }),

/***/ "./assets/_src/js/function-calls/sliders.js":
/*!**************************************************!*\
  !*** ./assets/_src/js/function-calls/sliders.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "callSliders": function() { return /* binding */ callSliders; }
/* harmony export */ });
/* harmony import */ var _sliders_slider_dsbls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sliders/slider-dsbls */ "./assets/_src/js/function-calls/sliders/slider-dsbls.js");
/* harmony import */ var _sliders_slider_simple__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./sliders/slider-simple */ "./assets/_src/js/function-calls/sliders/slider-simple.js");
/* harmony import */ var _sliders_slider_advanced__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sliders/slider-advanced */ "./assets/_src/js/function-calls/sliders/slider-advanced.js");
/* harmony import */ var _sliders_slider_circular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./sliders/slider-circular */ "./assets/_src/js/function-calls/sliders/slider-circular.js");
/* harmony import */ var _sliders_slider_extended__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./sliders/slider-extended */ "./assets/_src/js/function-calls/sliders/slider-extended.js");





var callSliders = function callSliders() {
  (0,_sliders_slider_dsbls__WEBPACK_IMPORTED_MODULE_0__.dsblsSlider)();
  (0,_sliders_slider_simple__WEBPACK_IMPORTED_MODULE_1__.simpleSliders)();
  (0,_sliders_slider_advanced__WEBPACK_IMPORTED_MODULE_2__.advancedSliders)();
  (0,_sliders_slider_circular__WEBPACK_IMPORTED_MODULE_3__.circularSliders)();
  (0,_sliders_slider_extended__WEBPACK_IMPORTED_MODULE_4__.extendedSliders)();
};


/***/ }),

/***/ "./assets/_src/js/function-calls/sliders/slider-advanced.js":
/*!******************************************************************!*\
  !*** ./assets/_src/js/function-calls/sliders/slider-advanced.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "advancedSliders": function() { return /* binding */ advancedSliders; }
/* harmony export */ });
/* harmony import */ var _library_sliders_swiper_with_tabs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../library/sliders/swiper-with-tabs */ "./assets/_src/js/library/sliders/swiper-with-tabs.js");
/* harmony import */ var _library_sliders_slider_options_autoplay__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../library/sliders/slider-options/autoplay */ "./assets/_src/js/library/sliders/slider-options/autoplay.js");
/* harmony import */ var _library_sliders_slider_options_lazy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../library/sliders/slider-options/lazy */ "./assets/_src/js/library/sliders/slider-options/lazy.js");
/* harmony import */ var _library_sliders_slider_options_breakpoints__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../library/sliders/slider-options/breakpoints */ "./assets/_src/js/library/sliders/slider-options/breakpoints.js");
/* harmony import */ var _library_sliders_slider_options_navigation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../library/sliders/slider-options/navigation */ "./assets/_src/js/library/sliders/slider-options/navigation.js");
/* harmony import */ var _library_sliders_slider_options_loop__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../library/sliders/slider-options/loop */ "./assets/_src/js/library/sliders/slider-options/loop.js");
/* harmony import */ var _library_sliders_slider_options_pagination__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../library/sliders/slider-options/pagination */ "./assets/_src/js/library/sliders/slider-options/pagination.js");
/* harmony import */ var _utils_u_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils/u_types */ "./assets/_src/js/utils/u_types.js");
/* harmony import */ var _library_sliders_slider_options_autoplayObserver__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../library/sliders/slider-options/autoplayObserver */ "./assets/_src/js/library/sliders/slider-options/autoplayObserver.js");
/* harmony import */ var _library_sliders_slider_options_effects__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../library/sliders/slider-options/effects */ "./assets/_src/js/library/sliders/slider-options/effects.js");
/**
 * Advanced slider type
 */












// config selectors only here
var advancedName = 'js-slider-advanced';
var advSliderSel = '.js-slider-advanced';
var advSliderTabs = '.l-slider-nav';

// find those selectors
var advSliderList = document.querySelectorAll(advSliderSel);
var advancedSliders = function advancedSliders() {
  // loop through sliders and add ID's to it

  var advSliderOptions = [];
  var advSliders = [];
  var sliderTabOptions = [];
  var advSliderNav = [];
  var sliderNav;
  var advSliderThumbs = [];
  var sliderThumbOptions = [];
  var advancedObserver = [];
  advSliderList.forEach(function (slider, i) {
    advSliderOptions[i] = {};
    var triggerType = slider.getAttribute('data-slider-trigger') || 'click';
    sliderTabOptions[i] = {
      item: '.js-nav__item',
      active: 'is-active',
      trigger: triggerType
    };
    sliderThumbOptions[i] = {
      spaceBetween: 10,
      slidesPerView: 'auto',
      freeMode: true,
      threshold: 10,
      watchSlidesProgress: true,
      wrapperClass: 'c-slider-nav'
    };
    var isThumbs = (0,_utils_u_types__WEBPACK_IMPORTED_MODULE_7__.u_parseBool)(slider.getAttribute('data-slider-thumbs'));
    var sliderID = "".concat(advancedName, "-").concat(i);
    slider.setAttribute('id', sliderID);
    var sliderParent = slider.closest('.m-slider');
    if (sliderParent) {
      sliderNav = sliderParent.querySelector(advSliderTabs);
    }
    var sliderThumbsSelector;
    if (sliderNav) {
      if (isThumbs) {
        var sliderThumbsID = "js-slider-advanced-thumbs-".concat(i);
        sliderNav.setAttribute('id', sliderThumbsID);
        sliderThumbsSelector = "#".concat(sliderThumbsID);
      } else {
        var sliderTabID = "js-slider-advanced-nav-".concat(i);
        sliderNav.setAttribute('id', sliderTabID);
        sliderTabOptions[i].element = "#".concat(sliderTabID);
      }
    }
    advSliderOptions[i] = (0,_library_sliders_slider_options_loop__WEBPACK_IMPORTED_MODULE_5__.isLoopOn)(slider, advSliderOptions[i]);
    advSliderOptions[i] = (0,_library_sliders_slider_options_autoplay__WEBPACK_IMPORTED_MODULE_1__.isAutoPlayOn)(slider, advSliderOptions[i]);
    advSliderOptions[i] = (0,_library_sliders_slider_options_lazy__WEBPACK_IMPORTED_MODULE_2__.isLazyLoadOn)(slider, advSliderOptions[i]);
    advSliderOptions[i] = (0,_library_sliders_slider_options_breakpoints__WEBPACK_IMPORTED_MODULE_3__.isBreakpointsOn)(slider, advSliderOptions[i]);
    advSliderOptions[i] = (0,_library_sliders_slider_options_pagination__WEBPACK_IMPORTED_MODULE_6__.isPaginationOn)(slider, advSliderOptions[i]);
    advSliderOptions[i] = (0,_library_sliders_slider_options_effects__WEBPACK_IMPORTED_MODULE_9__.isEffectOn)(slider, advSliderOptions[i]);

    // .m-slider parent is hardcoded in isNavigationOn options
    advSliderOptions[i] = (0,_library_sliders_slider_options_navigation__WEBPACK_IMPORTED_MODULE_4__.isNavigationOn)(slider, advSliderOptions[i], advancedName, i);
    if (isThumbs) {
      var isVertical = (0,_utils_u_types__WEBPACK_IMPORTED_MODULE_7__.u_parseBool)(slider.getAttribute('data-slider-vertical'));
      if (isVertical) {
        sliderThumbOptions[i].direction = 'vertical';
        // sliderThumbOptions[i].autoHeight = true;
        sliderParent.classList.add('swiper-thumbs-nav-vertical');
      }
      advSliderThumbs[i] = new Swiper(sliderThumbsSelector, sliderThumbOptions[i]);
      advSliderOptions[i].thumbs = {};
      advSliderOptions[i].thumbs.swiper = advSliderThumbs[i];
      advSliderOptions[i].noSwipingSelector = '.l-slider-nav, .m-slider__pagination';
    }
    advSliders[i] = new Swiper(slider, advSliderOptions[i]);
    if (sliderNav) {
      if (advSliders[i].initialized) {
        advSliderNav[i] = new _library_sliders_swiper_with_tabs__WEBPACK_IMPORTED_MODULE_0__["default"](advSliders[i], sliderTabOptions[i]);
      }
    }
    var isAutoplay = slider.getAttribute('data-slider-autoplay');
    var autoplayObserve = (0,_utils_u_types__WEBPACK_IMPORTED_MODULE_7__.u_parseBool)(slider.getAttribute('data-slider-autoplay-observer'));
    if (isAutoplay && autoplayObserve) {
      advSliders[i].autoplay.stop();
      advancedObserver.push({
        slider: sliderID
      });
    }
  });
  if (advancedObserver.length > 0) {
    (0,_library_sliders_slider_options_autoplayObserver__WEBPACK_IMPORTED_MODULE_8__.autoplayObserver)(advancedObserver, advancedName, advSliders);
  }
};


/***/ }),

/***/ "./assets/_src/js/function-calls/sliders/slider-circular.js":
/*!******************************************************************!*\
  !*** ./assets/_src/js/function-calls/sliders/slider-circular.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "circularSliders": function() { return /* binding */ circularSliders; }
/* harmony export */ });
/* harmony import */ var _library_sliders_slider_options_autoplay__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../library/sliders/slider-options/autoplay */ "./assets/_src/js/library/sliders/slider-options/autoplay.js");
/* harmony import */ var _library_sliders_slider_options_lazy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../library/sliders/slider-options/lazy */ "./assets/_src/js/library/sliders/slider-options/lazy.js");
/* harmony import */ var _library_sliders_slider_options_breakpoints__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../library/sliders/slider-options/breakpoints */ "./assets/_src/js/library/sliders/slider-options/breakpoints.js");
/* harmony import */ var _library_sliders_slider_options_navigation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../library/sliders/slider-options/navigation */ "./assets/_src/js/library/sliders/slider-options/navigation.js");
/* harmony import */ var _library_sliders_slider_options_loop__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../library/sliders/slider-options/loop */ "./assets/_src/js/library/sliders/slider-options/loop.js");
/* harmony import */ var _library_sliders_slider_options_effects__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../library/sliders/slider-options/effects */ "./assets/_src/js/library/sliders/slider-options/effects.js");
/* harmony import */ var _library_sliders_swiper_with_circular_tabs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../library/sliders/swiper-with-circular-tabs */ "./assets/_src/js/library/sliders/swiper-with-circular-tabs.js");
/* harmony import */ var _library_sliders_slider_options_pagination__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../library/sliders/slider-options/pagination */ "./assets/_src/js/library/sliders/slider-options/pagination.js");
/* harmony import */ var _utils_u_types__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../utils/u_types */ "./assets/_src/js/utils/u_types.js");
/**
 * Advanced slider type
 */











// config selectors only here
var advancedName = 'js-circular-adv';
var advSliderSel = '.js-circular-adv';
var advSliderTabs = '.l-slider-nav';

// find those selectors
var advSliderList = document.querySelectorAll(advSliderSel);
var circularSliders = function circularSliders() {
  // loop through sliders and add ID's to it

  var advSliderOptions = [];
  var advSliders = [];
  var sliderTabOptions = [];
  var advSliderNav = [];
  var sliderNav;
  var sliderThumbOptions = [];
  advSliderList.forEach(function (slider, i) {
    advSliderOptions[i] = {};
    sliderTabOptions[i] = {
      item: '.js-nav__item'
    };
    sliderThumbOptions[i] = {
      spaceBetween: 10,
      slidesPerView: 'auto',
      freeMode: true,
      threshold: 10,
      watchSlidesProgress: true,
      wrapperClass: 'c-slider-nav'
    };
    var sliderID = "".concat(advancedName, "-").concat(i);
    slider.setAttribute('id', sliderID);
    var sliderParent = slider.closest('.m-slider');
    if (sliderParent) {
      sliderNav = sliderParent.querySelector(advSliderTabs);
    }
    if (sliderNav) {
      var sliderTabID = "js-slider-circular-nav-".concat(i);
      sliderNav.setAttribute('id', sliderTabID);
      sliderTabOptions[i].element = "#".concat(sliderTabID);
    }
    var isCenterSlides = sliderNav.getAttribute('data-slider-circular-arrange');
    var isSymmetric = (0,_utils_u_types__WEBPACK_IMPORTED_MODULE_8__.u_parseBool)(sliderNav.getAttribute('data-slider-circular-symmetric')) || false;
    if (isCenterSlides === 'center' && !isSymmetric) {
      var cSliderNav = sliderNav.querySelector('.c-slider-nav');
      if (cSliderNav) {
        var initialIndex = parseInt(cSliderNav.getAttribute('data-initial-index'), 10);
        sliderNav.style.setProperty('--cAItem', initialIndex);
        advSliderOptions[i].initialSlide = initialIndex;
      }
    } else {
      sliderNav.style.setProperty('--cAItem', 0);
    }
    advSliderOptions[i] = (0,_library_sliders_slider_options_loop__WEBPACK_IMPORTED_MODULE_4__.isLoopOn)(slider, advSliderOptions[i]);
    advSliderOptions[i] = (0,_library_sliders_slider_options_autoplay__WEBPACK_IMPORTED_MODULE_0__.isAutoPlayOn)(slider, advSliderOptions[i]);
    advSliderOptions[i] = (0,_library_sliders_slider_options_lazy__WEBPACK_IMPORTED_MODULE_1__.isLazyLoadOn)(slider, advSliderOptions[i]);
    advSliderOptions[i] = (0,_library_sliders_slider_options_breakpoints__WEBPACK_IMPORTED_MODULE_2__.isBreakpointsOn)(slider, advSliderOptions[i]);
    advSliderOptions[i] = (0,_library_sliders_slider_options_effects__WEBPACK_IMPORTED_MODULE_5__.isEffectOn)(slider, advSliderOptions[i]);
    advSliderOptions[i] = (0,_library_sliders_slider_options_pagination__WEBPACK_IMPORTED_MODULE_7__.isPaginationOn)(slider, advSliderOptions[i]);

    // .m-slider parent is hardcoded in isNavigationOn options
    advSliderOptions[i] = (0,_library_sliders_slider_options_navigation__WEBPACK_IMPORTED_MODULE_3__.isNavigationOn)(slider, advSliderOptions[i], advancedName, i);
    advSliders[i] = new Swiper(slider, advSliderOptions[i]);
    if (sliderNav) {
      if (advSliders[i].initialized) {
        advSliderNav[i] = new _library_sliders_swiper_with_circular_tabs__WEBPACK_IMPORTED_MODULE_6__["default"](advSliders[i], sliderTabOptions[i]);
      }
    }
  });
};


/***/ }),

/***/ "./assets/_src/js/function-calls/sliders/slider-dsbls.js":
/*!***************************************************************!*\
  !*** ./assets/_src/js/function-calls/sliders/slider-dsbls.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "dsblsSlider": function() { return /* binding */ dsblsSlider; }
/* harmony export */ });
/* harmony import */ var _library_sliders_slider_dsbls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../library/sliders/slider-dsbls */ "./assets/_src/js/library/sliders/slider-dsbls.js");
/**
 * DSBLS SLIDER type
 */


// config selectors only here
var dsblsSel = '.js-slider-dsbls';
var dsblsSelMob = '.js-slider-dsbls-m';

// find those selectors
var dsblsSliderList = document.querySelectorAll(dsblsSel);
var dsblsSliderMobileList = document.querySelectorAll(dsblsSelMob);
var dsblsSlider = function dsblsSlider() {
  // loop through sliders and add ID's to it, we assume each 
  // dsbls slider has its own mobile slider as its
  // component, so no need to loop, search parent 
  // and query child element

  var dsbls = [];
  dsblsSliderList.forEach(function (slider, i) {
    var sliderID = "js-slider-dsbls-".concat(i);
    var sliderMobileID = "js-slider-dsbls-m-".concat(i);
    slider.setAttribute('id', sliderID);
    dsblsSliderMobileList[i].setAttribute('id', sliderMobileID);
    dsbls[i] = new _library_sliders_slider_dsbls__WEBPACK_IMPORTED_MODULE_0__["default"](sliderID);
  });
};


/***/ }),

/***/ "./assets/_src/js/function-calls/sliders/slider-extended.js":
/*!******************************************************************!*\
  !*** ./assets/_src/js/function-calls/sliders/slider-extended.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "extendedSliders": function() { return /* binding */ extendedSliders; }
/* harmony export */ });
/* harmony import */ var _library_sliders_swiper_with_tabs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../library/sliders/swiper-with-tabs */ "./assets/_src/js/library/sliders/swiper-with-tabs.js");
/* harmony import */ var _library_sliders_slider_options_autoplay__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../library/sliders/slider-options/autoplay */ "./assets/_src/js/library/sliders/slider-options/autoplay.js");
/* harmony import */ var _library_sliders_slider_options_lazy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../library/sliders/slider-options/lazy */ "./assets/_src/js/library/sliders/slider-options/lazy.js");
/* harmony import */ var _library_sliders_slider_options_breakpoints__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../library/sliders/slider-options/breakpoints */ "./assets/_src/js/library/sliders/slider-options/breakpoints.js");
/* harmony import */ var _library_sliders_slider_options_navigation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../library/sliders/slider-options/navigation */ "./assets/_src/js/library/sliders/slider-options/navigation.js");
/* harmony import */ var _library_sliders_slider_options_loop__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../library/sliders/slider-options/loop */ "./assets/_src/js/library/sliders/slider-options/loop.js");
/* harmony import */ var _library_sliders_slider_options_pagination__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../library/sliders/slider-options/pagination */ "./assets/_src/js/library/sliders/slider-options/pagination.js");
/* harmony import */ var _utils_u_types__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils/u_types */ "./assets/_src/js/utils/u_types.js");
/* harmony import */ var _library_sliders_slider_options_autoplayObserver__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../library/sliders/slider-options/autoplayObserver */ "./assets/_src/js/library/sliders/slider-options/autoplayObserver.js");
/* harmony import */ var _library_sliders_slider_options_effects__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../library/sliders/slider-options/effects */ "./assets/_src/js/library/sliders/slider-options/effects.js");
/**
 * Advanced slider type
 */












// config selectors only here
var advancedName = 'js-slider-extended';
var advSliderSel = '.js-slider-extended';
var advSliderTabs = '.l-slider-nav';
var advSliderContent = '.l-slider-content';

// find those selectors
var advSliderList = document.querySelectorAll(advSliderSel);
var extendedSliders = function extendedSliders() {
  // loop through sliders and add ID's to it

  var advSliderOptions = [];
  var advSliders = [];
  var sliderTabOptions = [];
  var advSliderNav = [];
  var sliderNav;
  var advSliderThumbs = [];
  var sliderThumbOptions = [];
  var advancedObserver = [];
  var advContentOptions = [];
  var advSlidersContent = [];
  var aReq = [];
  advSliderList.forEach(function (slider, i) {
    advSliderOptions[i] = {};
    var triggerType = slider.getAttribute('data-slider-trigger') || 'click';
    sliderTabOptions[i] = {
      item: '.js-nav__item',
      active: 'is-active',
      trigger: triggerType
    };
    sliderThumbOptions[i] = {
      spaceBetween: 10,
      slidesPerView: 'auto',
      freeMode: true,
      threshold: 10,
      watchSlidesProgress: true,
      wrapperClass: 'c-slider-nav'
    };
    advContentOptions[i] = {
      wrapperClass: 'l-slider-content__wrapper',
      slidesPerView: 1
    };
    var isThumbs = (0,_utils_u_types__WEBPACK_IMPORTED_MODULE_7__.u_parseBool)(slider.getAttribute('data-slider-thumbs'));
    var sliderID = "".concat(advancedName, "-").concat(i);
    slider.setAttribute('id', sliderID);
    var sliderParent = slider.closest('.m-slider');
    if (sliderParent) {
      sliderNav = sliderParent.querySelector(advSliderTabs);
    }
    var sliderThumbsSelector;
    if (sliderNav) {
      if (isThumbs) {
        var sliderThumbsID = "js-slider-extended-thumbs-".concat(i);
        sliderNav.setAttribute('id', sliderThumbsID);
        sliderThumbsSelector = "#".concat(sliderThumbsID);
      } else {
        var sliderTabID = "js-slider-extended-nav-".concat(i);
        sliderNav.setAttribute('id', sliderTabID);
        sliderTabOptions[i].element = "#".concat(sliderTabID);
      }
    }
    var sliderContent = sliderParent.querySelector(advSliderContent);
    var sliderContentID = "js-slider-extended-content-".concat(i);
    sliderContent.setAttribute('id', sliderContentID);
    var sliderContentSelector = "#".concat(sliderContentID);
    advSliderOptions[i] = (0,_library_sliders_slider_options_loop__WEBPACK_IMPORTED_MODULE_5__.isLoopOn)(slider, advSliderOptions[i]);
    advSliderOptions[i] = (0,_library_sliders_slider_options_autoplay__WEBPACK_IMPORTED_MODULE_1__.isAutoPlayOn)(slider, advSliderOptions[i]);
    advSliderOptions[i] = (0,_library_sliders_slider_options_lazy__WEBPACK_IMPORTED_MODULE_2__.isLazyLoadOn)(slider, advSliderOptions[i]);
    advSliderOptions[i] = (0,_library_sliders_slider_options_breakpoints__WEBPACK_IMPORTED_MODULE_3__.isBreakpointsOn)(slider, advSliderOptions[i]);
    advSliderOptions[i] = (0,_library_sliders_slider_options_pagination__WEBPACK_IMPORTED_MODULE_6__.isPaginationOn)(slider, advSliderOptions[i]);
    advSliderOptions[i] = (0,_library_sliders_slider_options_effects__WEBPACK_IMPORTED_MODULE_9__.isEffectOn)(slider, advSliderOptions[i]);

    // .m-slider parent is hardcoded in isNavigationOn options
    advSliderOptions[i] = (0,_library_sliders_slider_options_navigation__WEBPACK_IMPORTED_MODULE_4__.isNavigationOn)(slider, advSliderOptions[i], advancedName, i);
    if (isThumbs) {
      var isVertical = (0,_utils_u_types__WEBPACK_IMPORTED_MODULE_7__.u_parseBool)(slider.getAttribute('data-slider-vertical'));
      if (isVertical) {
        sliderThumbOptions[i].direction = 'vertical';
        // sliderThumbOptions[i].autoHeight = true;
        sliderParent.classList.add('swiper-thumbs-nav-vertical');
      }
      advSliderThumbs[i] = new Swiper(sliderThumbsSelector, sliderThumbOptions[i]);
      advSliderOptions[i].thumbs = {};
      advSliderOptions[i].thumbs.swiper = advSliderThumbs[i];
      advSliderOptions[i].noSwipingSelector = '.l-slider-nav, .m-slider__pagination';
    }
    advSliderOptions[i].on = {};
    advSliders[i] = new Swiper(slider, advSliderOptions[i]);
    advSlidersContent[i] = new Swiper(sliderContentSelector, advContentOptions[i]);
    advSlidersContent[i].controller.control = advSliders[i];
    advSliders[i].controller.control = advSlidersContent[i];
    if (sliderNav) {
      if (advSliders[i].initialized) {
        advSliderNav[i] = new _library_sliders_swiper_with_tabs__WEBPACK_IMPORTED_MODULE_0__["default"](advSliders[i], sliderTabOptions[i]);
      }
    }
    var isAutoplay = slider.getAttribute('data-slider-autoplay');
    var autoplayObserve = (0,_utils_u_types__WEBPACK_IMPORTED_MODULE_7__.u_parseBool)(slider.getAttribute('data-slider-autoplay-observer'));
    if (isAutoplay && autoplayObserve) {
      advSliders[i].autoplay.stop();
      advancedObserver.push({
        slider: sliderID
      });
    }
    var sliderProgress = sliderParent.querySelector('.c-slider-progress-fill');
    if (sliderProgress && isAutoplay) {
      aReq[i] = null;
      advSliders[i].on('realIndexChange', function (s) {
        var duration = s.params.autoplay.delay;
        animateProgress(duration, sliderProgress, i);
      });
      advSliders[i].on('sliderFirstMove', function (s) {
        cancelAnimationFrame(aReq[i]);
        // sliderProgress.style.setProperty('--aa', '0');
      });

      advSliders[i].on('autoplayStop', function (s) {
        cancelAnimationFrame(aReq[i]);
      });
      advSliders[i].on('autoplayStart', function (s) {
        var duration = s.params.autoplay.delay;
        animateProgress(duration, sliderProgress, i);
      });
      advSliders[i].on('slideResetTransitionEnd', function (s) {
        var duration = s.params.autoplay.delay;
        animateProgress(duration, sliderProgress, i);
      });
    }
  });
  if (advancedObserver.length > 0) {
    (0,_library_sliders_slider_options_autoplayObserver__WEBPACK_IMPORTED_MODULE_8__.autoplayObserver)(advancedObserver, advancedName, advSliders);
  }
  var animateProgress = function animateProgress(duration, el, i) {
    var start;
    var previousTimeStamp;
    var done = false;
    el.style.setProperty('--fillProgress', 0);
    var step = function step(timestamp) {
      if (start === undefined) {
        start = timestamp;
      }
      var elapsed = timestamp - start;
      if (previousTimeStamp !== timestamp) {
        var prog = Math.min(elapsed / duration, 1);
        el.style.setProperty('--fillProgress', "".concat(prog));
        if (prog === 1) done = true;
      }
      if (elapsed < duration) {
        previousTimeStamp = timestamp;
        if (!done) {
          aReq[i] = window.requestAnimationFrame(step);
        }
      }
    };
    aReq[i] = window.requestAnimationFrame(step);
  };
};


/***/ }),

/***/ "./assets/_src/js/function-calls/sliders/slider-simple.js":
/*!****************************************************************!*\
  !*** ./assets/_src/js/function-calls/sliders/slider-simple.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "simpleSliders": function() { return /* binding */ simpleSliders; }
/* harmony export */ });
/* harmony import */ var _library_sliders_slider_options_autoplay__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../library/sliders/slider-options/autoplay */ "./assets/_src/js/library/sliders/slider-options/autoplay.js");
/* harmony import */ var _library_sliders_slider_options_lazy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../library/sliders/slider-options/lazy */ "./assets/_src/js/library/sliders/slider-options/lazy.js");
/* harmony import */ var _library_sliders_slider_options_breakpoints__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../library/sliders/slider-options/breakpoints */ "./assets/_src/js/library/sliders/slider-options/breakpoints.js");
/* harmony import */ var _library_sliders_slider_options_navigation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../library/sliders/slider-options/navigation */ "./assets/_src/js/library/sliders/slider-options/navigation.js");
/* harmony import */ var _library_sliders_slider_options_pagination__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../library/sliders/slider-options/pagination */ "./assets/_src/js/library/sliders/slider-options/pagination.js");
/* harmony import */ var _library_sliders_slider_options_loop__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../library/sliders/slider-options/loop */ "./assets/_src/js/library/sliders/slider-options/loop.js");
/* harmony import */ var _utils_u_types__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils/u_types */ "./assets/_src/js/utils/u_types.js");
/* harmony import */ var _library_sliders_slider_options_autoplayObserver__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../library/sliders/slider-options/autoplayObserver */ "./assets/_src/js/library/sliders/slider-options/autoplayObserver.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "jquery");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
/**
 * Simple slider type
 */









// config selectors only here
var simpleName = 'js-slider-simple';
var simpleSliderSel = '.js-slider-simple';

// find those selectors
var simpleSliderList = document.querySelectorAll(simpleSliderSel);
var simpleSliders = function simpleSliders() {
  // loop through sliders and add ID's to it

  var simpleSliderOptions = [];
  var simpleSlidersList = [];
  var simpleObserver = [];
  simpleSliderList.forEach(function (slider, i) {
    simpleSliderOptions[i] = {};
    var sliderID = "".concat(simpleName, "-").concat(i);
    slider.setAttribute('id', sliderID);
    simpleSliderOptions[i] = (0,_library_sliders_slider_options_autoplay__WEBPACK_IMPORTED_MODULE_0__.isAutoPlayOn)(slider, simpleSliderOptions[i]);
    simpleSliderOptions[i] = (0,_library_sliders_slider_options_lazy__WEBPACK_IMPORTED_MODULE_1__.isLazyLoadOn)(slider, simpleSliderOptions[i]);
    simpleSliderOptions[i] = (0,_library_sliders_slider_options_pagination__WEBPACK_IMPORTED_MODULE_4__.isPaginationOn)(slider, simpleSliderOptions[i]);
    simpleSliderOptions[i] = (0,_library_sliders_slider_options_breakpoints__WEBPACK_IMPORTED_MODULE_2__.isBreakpointsOn)(slider, simpleSliderOptions[i]);
    simpleSliderOptions[i] = (0,_library_sliders_slider_options_loop__WEBPACK_IMPORTED_MODULE_5__.isLoopOn)(slider, simpleSliderOptions[i]);

    // .m-slider parent is hardcoded in isNavigationOn options
    simpleSliderOptions[i] = (0,_library_sliders_slider_options_navigation__WEBPACK_IMPORTED_MODULE_3__.isNavigationOn)(slider, simpleSliderOptions[i], simpleName, i);
    simpleSlidersList[i] = new Swiper(slider, simpleSliderOptions[i]);
    if (slider.classList.contains('slider-filter-tabs')) {
      // eslint-disable-next-line no-use-before-define
      filterSliders(slider, simpleSlidersList[i]);
    }
    var isAutoplay = slider.getAttribute('data-slider-autoplay');
    var autoplayObserve = (0,_utils_u_types__WEBPACK_IMPORTED_MODULE_6__.u_parseBool)(slider.getAttribute('data-slider-autoplay-observer'));
    if (isAutoplay && autoplayObserve) {
      simpleSlidersList[i].autoplay.stop();
      simpleObserver.push({
        slider: sliderID
      });
    }
    // console.log('slider columns', slider.getAttribute('data-slider-columns'));
    // console.log('slider items', slider.querySelectorAll('.swiper-slide').length);

    var sliderColumns = slider.getAttribute('data-slider-columns');
    var sliderItems = slider.querySelectorAll('.swiper-slide').length;
    if (window.screen.width >= 1024 && sliderItems <= sliderColumns) {
      slider.classList.add('-hide-pagination');
    } else {
      slider.classList.remove('-hide-pagination');
    }

    // extra thumbnails nav
    var _iterator = _createForOfIteratorHelper(slider.parentNode.querySelectorAll('.js-extra-nav')),
      _step;
    try {
      var _loop = function _loop() {
        var thumbsNav = _step.value;
        var thumbsNavBtns = thumbsNav.querySelectorAll('[data-js-slide]');
        simpleSlidersList[i].on('slideChange', function () {
          var totalSlides = slider.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)').length;
          var curIndex = simpleSlidersList[i].realIndex % totalSlides + 1;
          thumbsNav.style.setProperty('--navigation-items-current', curIndex);
          var _iterator2 = _createForOfIteratorHelper(thumbsNavBtns),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var thumbsNavBtn = _step2.value;
              thumbsNavBtn.classList[curIndex == $(thumbsNavBtn).data('js-slide') ? 'add' : 'remove']('-active');
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        });
        var _iterator3 = _createForOfIteratorHelper(thumbsNavBtns),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var thumbsNavBtn = _step3.value;
            thumbsNavBtn.addEventListener('click', function (e) {
              var goto = $(e.target).closest('[data-js-slide]').data('js-slide');
              simpleSlidersList[i].slideToLoop(goto - 1);
            });
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      };
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        _loop();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  });
  if (simpleObserver.length > 0) {
    (0,_library_sliders_slider_options_autoplayObserver__WEBPACK_IMPORTED_MODULE_7__.autoplayObserver)(simpleObserver, simpleName, simpleSlidersList);
  }
  window.addEventListener('hashchange', function (event) {
    // if (!isHashed) {
    //     //alert("location: " + document.location + ",
    //     state: " + JSON.stringify(event.state));
    // }
  }, false);
};
var filterSliders = function filterSliders(selector, slider) {
  if (!selector) return;
  var sliderContainer = selector.closest('.m-slider');
  var slides = selector.querySelectorAll('.m-slider__slide');
  var filterContainer = sliderContainer.querySelector('.js-slider-fnav');
  if (!filterContainer) return;
  var filterItems = filterContainer.querySelectorAll('.js-filter-fnav-item a');
  var filterDropdown = filterContainer.querySelector('.js-slider-fnav-dropdown');
  var isHashed = false;
  filterItems.forEach(function (item) {
    item.addEventListener('click', function (ev) {
      var clickedItem = ev.currentTarget;
      var clickedItemParent = clickedItem.closest('.js-filter-fnav-item');
      // const href = clickedItem.

      if (clickedItemParent.classList.contains('is-active')) {
        return;
      }
      filterItems.forEach(function (clicked) {
        clicked.closest('.js-filter-fnav-item').classList.remove('is-active');
      });
      clickedItemParent.classList.add('is-active');
      var clickedFilter = ev.currentTarget.getAttribute('data-slider-filter');
      var clickedHref = ev.currentTarget.getAttribute('href');
      ev.preventDefault();
      if (clickedHref.indexOf('#') > -1) {
        var urlSplit = clickedHref.split('#');
        var newHash = urlSplit[1];
        window.location.hash = newHash;
        isHashed = true;
      }

      // console.log(clickedHref, ' 5');
      // console.log(isHashed, '1');
      filterSlides(clickedFilter);
    });
  });
  var filterSlides = function filterSlides(filter) {
    var filterString = filter;
    if (filterString === 'all') filterString = '';
    for (var i = 0; i < slides.length; i += 1) {
      var slidesCategories = slides[i].getAttribute('data-categories').split(',');
      var hasFilter = false;
      for (var j = 0; j < slidesCategories.length; j += 1) {
        if (slidesCategories[j].indexOf(filterString) !== -1) {
          hasFilter = true;
        }
      }
      if (hasFilter) {
        slides[i].style.display = '';
        slides[i].classList.add('swiper-slide');
      } else {
        slides[i].classList.remove('swiper-slide');
        slides[i].style.display = 'none';
      }
      // console.log(slidesCategories);
      // console.log(slides[i].getAttribute('data-categories'));
    }

    slider.updateSize();
    slider.updateSlides();
    slider.updateProgress();
    slider.updateSlidesClasses();
    slider.slideToLoop(0);
    slider.scrollbar.updateSize();
  };
  // window.onpopstate = function(event)
  // {
  //     console.log(isHashed, '0');
  //     if(isHashed) {
  //         event.preventDefault();
  //         isHashed = false;
  //         return;
  //     }
  //     console.log(isHashed, '2');
  //
  //     alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
  // };
};



/***/ }),

/***/ "./assets/_src/js/function-calls/tabs-to-accordion-mobile.js":
/*!*******************************************************************!*\
  !*** ./assets/_src/js/function-calls/tabs-to-accordion-mobile.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "callTabAccordionsMobile": function() { return /* binding */ callTabAccordionsMobile; }
/* harmony export */ });
/* harmony import */ var _library_tabs_accordions_DSMPTabsToAccordionMobile__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../library/tabs-accordions/DSMPTabsToAccordionMobile */ "./assets/_src/js/library/tabs-accordions/DSMPTabsToAccordionMobile.js");

var tabaccID = 'js-tab-acc';
var tabaccSelector = '.js-tabs-to-acc-wrapper';
var tabaccItems = document.querySelectorAll(tabaccSelector);
var callTabAccordionsMobile = function callTabAccordionsMobile() {
  tabaccItems.forEach(function (acc, i) {
    var taID = "".concat(tabaccID, "-").concat(i);
    var callID = "#".concat(taID);
    acc.setAttribute('id', taID);
    new _library_tabs_accordions_DSMPTabsToAccordionMobile__WEBPACK_IMPORTED_MODULE_0__["default"](callID);
  });
};


/***/ }),

/***/ "./assets/_src/js/function-calls/tinymce-read-more/ds_readMore.js":
/*!************************************************************************!*\
  !*** ./assets/_src/js/function-calls/tinymce-read-more/ds_readMore.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ds_readMore": function() { return /* binding */ ds_readMore; }
/* harmony export */ });
var ds_readMore = function ds_readMore() {
  var readMoreWrappers = document.querySelectorAll('.read-more-wrapper');
  readMoreWrappers.forEach(function (readMoreWrapper) {
    var readMoreBtn = readMoreWrapper.querySelector('.js-read-more-toggle');
    var btnTextNoActive = readMoreBtn.getAttribute('data-show-less-text');
    var btnTextActive = readMoreBtn.children[0].textContent;
    var readMoreText = readMoreWrapper.querySelector('.read-more-text');
    readMoreBtn.addEventListener('click', function () {
      var isActive = readMoreWrapper.classList.contains('is-active');
      var readMoreTextHeight = readMoreText.scrollHeight;
      if (isActive) {
        readMoreWrapper.classList.remove('is-active');
        readMoreBtn.children[0].textContent = btnTextActive;
        readMoreText.style.maxHeight = 0;
      } else {
        readMoreWrapper.classList.add('is-active');
        readMoreBtn.children[0].textContent = btnTextNoActive;
        readMoreText.style.maxHeight = "".concat(readMoreTextHeight, "px");
      }
    });
  });
};


/***/ }),

/***/ "./assets/_src/js/header/ds_headerMenuToggle.js":
/*!******************************************************!*\
  !*** ./assets/_src/js/header/ds_headerMenuToggle.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ds_headerMenuToggle": function() { return /* binding */ ds_headerMenuToggle; }
/* harmony export */ });
/* harmony import */ var _utils_u_menu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/u-menu */ "./assets/_src/js/header/utils/u-menu.js");


/**
 * Toggle mobile nav on click.
 * Toggle desktop burger menu on click.
 *
 * @param {string} el - selector for adding an active class
 */

var ds_headerMenuToggle = function ds_headerMenuToggle(el) {
  if (document.querySelector(el)) {
    var btn = document.querySelector(el);
    var body = document.querySelector('body');
    btn.addEventListener('click', function (event) {
      event.preventDefault();
      if (btn.getAttribute('aria-expanded') === 'false') {
        (0,_utils_u_menu__WEBPACK_IMPORTED_MODULE_0__.openMobileMenu)(btn, body);
      } else {
        (0,_utils_u_menu__WEBPACK_IMPORTED_MODULE_0__.closeMobileMenu)(btn, body);
      }
    });
  }
};


/***/ }),

/***/ "./assets/_src/js/header/ds_headerMobileSwipeUp.js":
/*!*********************************************************!*\
  !*** ./assets/_src/js/header/ds_headerMobileSwipeUp.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ds_headerMobileSwipeUp": function() { return /* binding */ ds_headerMobileSwipeUp; }
/* harmony export */ });
/* harmony import */ var _utils_u_is_touch_device__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/u_is-touch-device */ "./assets/_src/js/utils/u_is-touch-device.js");
/* harmony import */ var _utils_u_menu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/u-menu */ "./assets/_src/js/header/utils/u-menu.js");



/**
 * Mobile menu swipe up menu close
 */

var ds_headerMobileSwipeUp = function ds_headerMobileSwipeUp(el) {
  var mobileNav = document.querySelector('.navbar-mobile__inner');
  if (!mobileNav) return;
  var btn = document.querySelector(el);
  var body = document.querySelector('body');
  var xDown = null;
  var yDown = null;
  var touch = (0,_utils_u_is_touch_device__WEBPACK_IMPORTED_MODULE_0__.u_isTouchDevice)();
  if (touch) {
    var isScrollableY = function isScrollableY(element) {
      return element.scrollHeight > element.offsetHeight;
    };
    var handleTouchMove = function handleTouchMove(evt) {
      if (!xDown || !yDown) {
        return;
      }
      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;
      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;
      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
          /* left swipe */
        } else {
          /* right swipe */
        }
      } else if (yDiff > 0) {
        /* up swipe */
        if (!isScrollableY(mobileNav)) {
          (0,_utils_u_menu__WEBPACK_IMPORTED_MODULE_1__.closeMobileMenu)(btn, body);
        }
      } else {
        /* down swipe */
      }
      /* reset values */
      xDown = null;
      yDown = null;
    };
    var handleTouchStart = function handleTouchStart(evt) {
      xDown = evt.touches[0].clientX;
      yDown = evt.touches[0].clientY;
    };
    mobileNav.addEventListener('touchmove', function (e) {
      handleTouchMove(e);
      mobileNav.removeEventListener('touchstart', function () {}, {
        once: true
      });
    }, false);
    mobileNav.addEventListener('touchstart', function (e) {
      handleTouchStart(e);
      mobileNav.removeEventListener('touchmove', function () {}, {
        once: true
      });
    }, false);
  }
};


/***/ }),

/***/ "./assets/_src/js/header/ds_headerSearch.js":
/*!**************************************************!*\
  !*** ./assets/_src/js/header/ds_headerSearch.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ds_headerSearch": function() { return /* binding */ ds_headerSearch; }
/* harmony export */ });
/* harmony import */ var _utils_u_show_hide_display__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/u_show-hide-display */ "./assets/_src/js/utils/u_show-hide-display.js");
/**
 * Search Overlay
 */

var ds_headerSearch = function ds_headerSearch() {
  var targets = document.querySelectorAll('[data-js="search-target"]');

  // When Search Overlay exists
  if (targets) {
    targets.forEach(function (target) {
      var input = target.querySelector('.search-field');
      var showOverlay = function showOverlay() {
        (0,_utils_u_show_hide_display__WEBPACK_IMPORTED_MODULE_0__.u_showElem)(target);
        input.focus();
        document.body.classList.add('ds-overlay-search');
      };
      var closeOverlay = function closeOverlay() {
        (0,_utils_u_show_hide_display__WEBPACK_IMPORTED_MODULE_0__.u_hideElem)(target);
        document.body.classList.add('ds-overlay-search');
      };
      document.addEventListener('click', function (e) {
        // Trigger submit when opened
        if (e.target.matches('[data-js="search-trigger"]') && target.classList.contains('is-shown')) {
          input.click();
        }

        // Open an overlay
        if (e.target.matches('[data-js="search-trigger"]')) {
          e.preventDefault();
          showOverlay();
        }

        // Close an overlay
        if (e.target.matches('[data-js="search-close"]')) {
          e.preventDefault();
          closeOverlay();
        }
      }, false);
      document.addEventListener('keydown', function (e) {
        // Check if the search overlay is opened
        if (document.body.classList.contains('ds-overlay-search')) {
          // Close an overlay on Escape key click
          if (e.key === 'Escape' || e.keyCode === 27) {
            closeOverlay();
          }
        }
      });
    });
  }
};


/***/ }),

/***/ "./assets/_src/js/header/ds_headerSticky.js":
/*!**************************************************!*\
  !*** ./assets/_src/js/header/ds_headerSticky.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ds_headerSticky": function() { return /* binding */ ds_headerSticky; }
/* harmony export */ });
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/utils */ "./assets/_src/js/utils/utils.js");
/**
 * Add class on scroll for sticky header
 * @param {string} el - selector for adding an active class
 * @param {string} elClass - active class
 */


var ds_headerSticky = function ds_headerSticky(el, elClass) {
  var $$header = document.querySelector(el);
  var elHeight = parseInt($$header.offsetHeight / 2, 10);
  var offset = parseInt(elHeight / 5, 10);
  var onScroll = function onScroll() {
    // if (window.pageYOffset > (elHeight + offset)) {
    if (window.pageYOffset > 25) {
      $$header.classList.add(elClass);
    } else if (window.pageYOffset < elHeight - offset) {
      $$header.classList.remove(elClass);
    }
  };
  var throttleScroll = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_0__.u_throttled)(function () {
    onScroll();
  }, 30);
  window.addEventListener('scroll', function () {
    throttleScroll();
  });
  if (window.pageYOffset > elHeight + offset) {
    $$header.classList.add(elClass);
  }
};


/***/ }),

/***/ "./assets/_src/js/header/ds_menuSubMenuToggle.js":
/*!*******************************************************!*\
  !*** ./assets/_src/js/header/ds_menuSubMenuToggle.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ds_headerMenuSubMenuToggle": function() { return /* binding */ ds_headerMenuSubMenuToggle; }
/* harmony export */ });
/* harmony import */ var _utils_u_menu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/u-menu */ "./assets/_src/js/header/utils/u-menu.js");
/**
 * Submenu toggle for Mobile Menu and Desktop Burger menu
 *
 * @param {string} el - selector for adding an active class
 * @param {string} closeEl - selector for closing all submenu items
 */


var ds_headerMenuSubMenuToggle = function ds_headerMenuSubMenuToggle(el, closeEl) {
  var ele = document.querySelector(el);
  if (!ele) return;
  var closeEle = document.querySelector(closeEl);
  var toggleButtons = ele.querySelectorAll('.js-sub-menu-toggle');
  toggleButtons.forEach(function (toggleButton) {
    var toggleContent = toggleButton.nextElementSibling;
    var toggleButtonMenuItem = toggleButton.parentElement;
    (0,_utils_u_menu__WEBPACK_IMPORTED_MODULE_0__.closeSubMenu)(toggleButton, toggleButtonMenuItem, toggleContent);
    toggleButton.addEventListener('click', function () {
      var isToggled = toggleButton.className.includes('is-toggled');
      (0,_utils_u_menu__WEBPACK_IMPORTED_MODULE_0__.closeSubMenu)(toggleButton, toggleButtonMenuItem, toggleContent);
      (0,_utils_u_menu__WEBPACK_IMPORTED_MODULE_0__.checkChildSubMenu)(toggleButton);
      if (!isToggled) {
        (0,_utils_u_menu__WEBPACK_IMPORTED_MODULE_0__.openSubMenu)(toggleButton, toggleButtonMenuItem, toggleContent);
      }
    });
  });
  if (closeEle) {
    closeEle.addEventListener('click', function () {
      toggleButtons.forEach(function (toggleButton) {
        var toggleContent = toggleButton.nextElementSibling;
        var toggleButtonMenuItem = toggleButton.parentElement;
        (0,_utils_u_menu__WEBPACK_IMPORTED_MODULE_0__.closeSubMenu)(toggleButton, toggleButtonMenuItem, toggleContent);
      });
    });
  }
  var element = document.querySelector("#menu-language-menu-1, #menu-secondary-language-menu-1");
  if (element) {
    var newItem = document.createElement("li");
    newItem.className = "links-list__item";
    newItem.appendChild(element);
    var destination = document.querySelector(".navbar-mobile__inner > .links-list");
    if (destination) {
      destination.appendChild(newItem);
      var parent = element.parentNode.parentNode;
      if (parent.classList.contains("site-header__widget")) {
        parent.remove();
      }
      var link = document.querySelector("#menu-language-menu-1 > li > a, #menu-secondary-language-menu-1 > li > a");
      link.addEventListener('click', function (event) {
        var subMenu = document.querySelector("#menu-language-menu-1 > li > .sub-menu, #menu-secondary-language-menu-1 > li > .sub-menu");
        if (subMenu) {
          event.preventDefault();
          link.classList.add("is-active");
          subMenu.classList.add("is-visible");
        }
      });
      element.addEventListener('focusout', function () {
        var subMenu = document.querySelector("#menu-language-menu-1 > li > .sub-menu, #menu-secondary-language-menu-1 > li > .sub-menu");
        if (subMenu) {
          link.classList.remove("is-active");
          subMenu.classList.remove("is-visible");
        }
      });
    }
  }
};


/***/ }),

/***/ "./assets/_src/js/header/ds_puma_global.js":
/*!*************************************************!*\
  !*** ./assets/_src/js/header/ds_puma_global.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ds_pumaGlobal": function() { return /* binding */ ds_pumaGlobal; }
/* harmony export */ });
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "jquery");
function ds_pumaGlobal() {
  $(document).click(function (event) {
    if ($('.puma-global').hasClass('is-active')) {
      var $target = $(event.target);
      if (!$target.closest('.puma-global').length) {
        $('.puma-global').removeClass('is-active');
      }
    }
  });
  $('.js-puma-global').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    if ($('.puma-global').hasClass('is-active')) {
      $('.puma-global').removeClass('is-active');
    } else {
      $('.puma-global').addClass('is-active');
    }
  });
  if ($(window).width() > 767) {
    $('.puma-global .c-accordion__content').each(function () {
      var countries = $(this).find('.country');
      var columns = Math.ceil(countries.length / 5);
      columns = columns > 5 ? 5 : columns;
      var itemsPerColumn = 5;
      for (var i = 0; i < columns; i++) {
        var column = $('<div>').addClass('column');
        for (var j = 0; j < itemsPerColumn; j++) {
          var country = countries[i * itemsPerColumn + j];
          if (country) {
            column.append(country);
          }
        }
        $(this).append(column);
      }
    });
  }
}

/***/ }),

/***/ "./assets/_src/js/header/utils/u-menu.js":
/*!***********************************************!*\
  !*** ./assets/_src/js/header/utils/u-menu.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "checkChildSubMenu": function() { return /* binding */ checkChildSubMenu; },
/* harmony export */   "closeMobileMenu": function() { return /* binding */ closeMobileMenu; },
/* harmony export */   "closeSubMenu": function() { return /* binding */ closeSubMenu; },
/* harmony export */   "openMobileMenu": function() { return /* binding */ openMobileMenu; },
/* harmony export */   "openSubMenu": function() { return /* binding */ openSubMenu; }
/* harmony export */ });
// Open mobile menu
var openMobileMenu = function openMobileMenu(btn, body) {
  btn.classList.add('is-active');
  body.classList.add('nav-active');
  btn.setAttribute('aria-expanded', 'true');
};

// Close mobile menu
var closeMobileMenu = function closeMobileMenu(btn, body) {
  btn.classList.remove('is-active');
  body.classList.remove('nav-active');
  btn.setAttribute('aria-expanded', 'false');
};

// Show submenu items
var showHideSubItem = function showHideSubItem(subItem, type, ariaAttr) {
  if (subItem) {
    subItem.classList[type]('is-visible');
    // eslint-disable-next-line no-param-reassign
    subItem.ariaExpanded = [ariaAttr];
    // subItem.style.height = `${ height }px`;
  }
};

// Open submenu
var openSubMenu = function openSubMenu(item, itemParent, itemMenu) {
  item.classList.add('is-toggled');
  itemParent.classList.add('is-opened');
  showHideSubItem(itemMenu, 'add', 'true');
};

// Close submenu
var closeSubMenu = function closeSubMenu(item, itemParent, itemMenu) {
  item.classList.remove('is-toggled');
  itemParent.classList.remove('is-opened');
  showHideSubItem(itemMenu, 'remove', 'false');
};

// Check for submenu items
var checkChildSubMenu = function checkChildSubMenu(item) {
  var toggleInnerButton = Array.from(item.nextElementSibling.getElementsByClassName('js-sub-menu-toggle'));
  if (toggleInnerButton) {
    toggleInnerButton.forEach(function (innerItem) {
      var childSubMenu = innerItem.nextElementSibling;
      if (childSubMenu.ariaExpanded === 'true') {
        childSubMenu.ariaExpanded = 'false';
      } else if (childSubMenu.classList.contains('is-visible')) {
        childSubMenu.ariaExpanded = 'true';
      }
    });
  }
};


/***/ }),

/***/ "./assets/_src/js/library/3d-media/spinner-controls/autoanimate.js":
/*!*************************************************************************!*\
  !*** ./assets/_src/js/library/3d-media/spinner-controls/autoanimate.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isAnimateOn": function() { return /* binding */ isAnimateOn; }
/* harmony export */ });
/**
 * Image Spinner Options - auto animation
 */

var isAnimateOn = function isAnimateOn(elem, options) {
  if (!elem) return options;
  var isAnimate = elem.getAttribute('data-spinner-autoanimate');
  if (isAnimate === 'true') {
    options.animate = true;
  }
  return options;
};


/***/ }),

/***/ "./assets/_src/js/library/3d-media/spinner-controls/frames-nav.js":
/*!************************************************************************!*\
  !*** ./assets/_src/js/library/3d-media/spinner-controls/frames-nav.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isFramesNavOn": function() { return /* binding */ isFramesNavOn; }
/* harmony export */ });
/**
 * Image Spinner Controls - Frame by frame navigation
 */

var isFramesNavOn = function isFramesNavOn(elem, options) {
  if (!elem) return options;
  var isFramesNav = elem.getAttribute('data-ctrl-frames-nav');
  if (isFramesNav === 'true') {
    options.plugins.push('dsFramesNavControl');
  }
  return options;
};


/***/ }),

/***/ "./assets/_src/js/library/3d-media/spinner-controls/fullscreen.js":
/*!************************************************************************!*\
  !*** ./assets/_src/js/library/3d-media/spinner-controls/fullscreen.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isFullScreenOn": function() { return /* binding */ isFullScreenOn; }
/* harmony export */ });
/**
 * Image Spinner Controls - Full Screen
 */

var isFullScreenOn = function isFullScreenOn(elem, options) {
  if (!elem) return options;
  var isFullScreen = elem.getAttribute('data-ctrl-fullscr');
  if (isFullScreen === 'true') {
    options.plugins.push('dsFullScreenControl');
  }
  return options;
};


/***/ }),

/***/ "./assets/_src/js/library/3d-media/spinner-controls/hotspots-nav.js":
/*!**************************************************************************!*\
  !*** ./assets/_src/js/library/3d-media/spinner-controls/hotspots-nav.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isHotspotsOn": function() { return /* binding */ isHotspotsOn; }
/* harmony export */ });
/**
 * Image Spinner Controls - Hotspots navigation
 */

var isHotspotsOn = function isHotspotsOn(elem, options) {
  if (!elem) return options;
  var isHotspots = elem.getAttribute('data-spinner-has-hotspots');
  if (isHotspots === 'true') {
    options.plugins.push('dsHotSpots');
  }
  return options;
};


/***/ }),

/***/ "./assets/_src/js/library/3d-media/spinner-controls/playback.js":
/*!**********************************************************************!*\
  !*** ./assets/_src/js/library/3d-media/spinner-controls/playback.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isPlaybackOn": function() { return /* binding */ isPlaybackOn; }
/* harmony export */ });
/**
 * Image Spinner Controls - Playback
 */

var isPlaybackOn = function isPlaybackOn(elem, options) {
  if (!elem) return options;
  var isPlayback = elem.getAttribute('data-ctrl-playback');
  if (isPlayback === 'true') {
    options.plugins.push('dsPlaybackControl');
  }
  return options;
};


/***/ }),

/***/ "./assets/_src/js/library/3d-media/spinner-controls/progress-fraction.js":
/*!*******************************************************************************!*\
  !*** ./assets/_src/js/library/3d-media/spinner-controls/progress-fraction.js ***!
  \*******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isFractionOn": function() { return /* binding */ isFractionOn; }
/* harmony export */ });
/**
 * Image Spinner Options - Progress - Fraction
 */

var isFractionOn = function isFractionOn(elem, options) {
  if (!elem) return options;
  var isFraction = elem.getAttribute('data-ctrl-progress-fraction');
  if (isFraction === 'true') {
    options.plugins.push('dsProgressFraction');
  }
  return options;
};


/***/ }),

/***/ "./assets/_src/js/library/3d-media/spinner-controls/zoom.js":
/*!******************************************************************!*\
  !*** ./assets/_src/js/library/3d-media/spinner-controls/zoom.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isZoomOn": function() { return /* binding */ isZoomOn; }
/* harmony export */ });
/**
 * Image Spinner Controls - Zoom
 */

var isZoomOn = function isZoomOn(elem, options) {
  if (!elem) return options;
  var isZoom = elem.getAttribute('data-ctrl-zoom');
  if (isZoom === 'true') {
    options.plugins.push('dsZoomControl', 'zoom');
  }
  return options;
};


/***/ }),

/***/ "./assets/_src/js/library/3d-media/spinner-plugins/ctrl-drag-plugin.js":
/*!*****************************************************************************!*\
  !*** ./assets/_src/js/library/3d-media/spinner-plugins/ctrl-drag-plugin.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isDragOn": function() { return /* binding */ isDragOn; }
/* harmony export */ });
/**
 * Image Spinner Options - 'drag' plugin
 */

var isDragOn = function isDragOn(elem, options) {
  if (!elem) return options;
  var isDrag = elem.getAttribute('data-spinner-drag');
  if (isDrag === 'true') {
    options.plugins.push('drag');
  }
  return options;
};


/***/ }),

/***/ "./assets/_src/js/library/3d-media/spinner-plugins/ctrl-frames-nav-plugin.js":
/*!***********************************************************************************!*\
  !*** ./assets/_src/js/library/3d-media/spinner-plugins/ctrl-frames-nav-plugin.js ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "registerFramesNavControlPlugin": function() { return /* binding */ registerFramesNavControlPlugin; }
/* harmony export */ });
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "jquery");
/**
 * Image Spinner Plugin - dsFramesNavControl
 */

function framesNavControl(spinnerElem) {
  var api = spinnerElem.spritespin('api');
  var spinnerModule = spinnerElem.closest('.m-image-spinner');
  var hotspotEl = spinnerModule.find('.hotspot');
  var hsContentListItem = spinnerModule.find('.js-hotspots-list-item');
  var ctrlBttnPrev = spinnerModule.find('.js-image-spinner-prev');
  var ctrlBttnNext = spinnerModule.find('.js-image-spinner-next');
  if (0 < ctrlBttnPrev.length) {
    ctrlBttnPrev.on('click', function (e) {
      // Get original 'reverse' setting
      api.data.reverse = api.data.forceReverse;
      api.prevFrame();

      // hide all hotspots
      hotspotEl.removeClass('is-active');
      hotspotEl.hide();
      // deactivate all labels
      hsContentListItem.removeClass('is-active');
      // show current hotspots for this frame
      api.data.stage.find(".hotspot.hotspot-frame-" + api.data.frame).stop(false).fadeIn();
    });
  }
  if (0 < ctrlBttnNext.length) {
    ctrlBttnNext.on('click', function (e) {
      // Get original 'reverse' setting
      api.data.reverse = api.data.forceReverse;
      api.nextFrame();

      // hide all hotspots
      hotspotEl.removeClass('is-active');
      hotspotEl.hide();
      // deactivate all labels
      hsContentListItem.removeClass('is-active');
      // show current hotspots for this frame
      api.data.stage.find(".hotspot.hotspot-frame-" + api.data.frame).stop(false).fadeIn();
    });
  }
}
var registerFramesNavControlPlugin = function registerFramesNavControlPlugin(label) {
  SpriteSpin.registerPlugin(label, {
    onLoad: function onLoad(ev) {
      framesNavControl($(ev.target));
    }
  });
};


/***/ }),

/***/ "./assets/_src/js/library/3d-media/spinner-plugins/ctrl-fullscreen-plugin.js":
/*!***********************************************************************************!*\
  !*** ./assets/_src/js/library/3d-media/spinner-plugins/ctrl-fullscreen-plugin.js ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "registerFullscrControlPlugin": function() { return /* binding */ registerFullscrControlPlugin; }
/* harmony export */ });
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "jquery");
/**
 * Image Spinner Plugin - dsFullScreenControl
 */

function fullscrControl(spinnerElem) {
  var api = spinnerElem.spritespin('api');
  var spinnerModule = spinnerElem.closest('.m-image-spinner');
  var ctrlBttnFullScr = spinnerModule.find('.js-image-spinner-fullscr');
  if (0 < ctrlBttnFullScr.length) {
    ctrlBttnFullScr.on('click', function (e) {
      api.requestFullscreen();
    });
  }
}
var registerFullscrControlPlugin = function registerFullscrControlPlugin(label) {
  SpriteSpin.registerPlugin(label, {
    onLoad: function onLoad(ev) {
      fullscrControl($(ev.target));
    }
  });
};


/***/ }),

/***/ "./assets/_src/js/library/3d-media/spinner-plugins/ctrl-playback-plugin.js":
/*!*********************************************************************************!*\
  !*** ./assets/_src/js/library/3d-media/spinner-plugins/ctrl-playback-plugin.js ***!
  \*********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "registerPlaybackControlPlugin": function() { return /* binding */ registerPlaybackControlPlugin; }
/* harmony export */ });
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "jquery");
/**
 * Image Spinner Plugin - dsPlaybackControl
 */

function playbackControl(spinnerElem) {
  var api = spinnerElem.spritespin('api');
  var spinnerModule = spinnerElem.closest('.m-image-spinner');
  var hotspotEl = spinnerModule.find('.hotspot');
  var hsContentListItem = spinnerModule.find('.js-hotspots-list-item');
  var ctrlBttnPlay = spinnerModule.find('.js-image-spinner-play');
  if (0 < ctrlBttnPlay.length) {
    ctrlBttnPlay.on('click', function (e) {
      // Get original 'reverse' setting
      api.data.reverse = api.data.forceReverse;
      api.toggleAnimation();
      if (true === api.isPlaying()) {
        hsContentListItem.removeClass('is-active');
        hotspotEl.removeClass('is-active');
        hotspotEl.hide();
        spinnerModule.addClass('is-playing');
      } else {
        spinnerModule.removeClass('is-playing');
      }
    });
  }
}
var registerPlaybackControlPlugin = function registerPlaybackControlPlugin(label) {
  SpriteSpin.registerPlugin(label, {
    onLoad: function onLoad(ev) {
      playbackControl($(ev.target));
    }
  });
};


/***/ }),

/***/ "./assets/_src/js/library/3d-media/spinner-plugins/ctrl-zoom-plugin.js":
/*!*****************************************************************************!*\
  !*** ./assets/_src/js/library/3d-media/spinner-plugins/ctrl-zoom-plugin.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "registerZoomControlPlugin": function() { return /* binding */ registerZoomControlPlugin; }
/* harmony export */ });
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "jquery");
/**
 * Image Spinner Plugin - dsZoomControl
 */

function zoomControl(spinnerElem) {
  var api = spinnerElem.spritespin('api');
  var spinnerModule = spinnerElem.closest('.m-image-spinner');
  var ctrlBttnZoom = spinnerModule.find('.js-image-spinner-zoom');
  if (0 < ctrlBttnZoom.length) {
    ctrlBttnZoom.on('click', function (e) {
      api.toggleZoom();
      spinnerModule.toggleClass('is-zoom');
    });
  }
}
var registerZoomControlPlugin = function registerZoomControlPlugin(label) {
  SpriteSpin.registerPlugin(label, {
    onLoad: function onLoad(ev) {
      zoomControl($(ev.target));
    }
  });
};


/***/ }),

/***/ "./assets/_src/js/library/3d-media/spinner-plugins/hotspots-plugin.js":
/*!****************************************************************************!*\
  !*** ./assets/_src/js/library/3d-media/spinner-plugins/hotspots-plugin.js ***!
  \****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "registerHotSpotsPlugin": function() { return /* binding */ registerHotSpotsPlugin; }
/* harmony export */ });
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "jquery");
/**
 * Image Spinner Plugin - dsHotSpots
 */

function normalizeItemIndex(index, arr) {
  var itemIndex = index;
  if (itemIndex < 0) {
    itemIndex = arr.length - 1;
  }
  if (itemIndex >= arr.length) {
    itemIndex = 0;
  }
  return itemIndex;
}

/**
 * Append hotspots to spinner stage
 */
function assignHotspots(spinnerElem) {
  var spinnerModule = spinnerElem.closest('.m-image-spinner');
  if (!spinnerModule.attr('data-spinner-has-hotspots')) {
    return;
  }
  if (!spinnerModule.attr('data-hotspots-frames')) {
    return;
  }
  var hotspotEl = spinnerModule.find('.hotspot');
  var api = spinnerElem.spritespin('api');
  var data = api.data;
  var hotspotsHTML = spinnerModule.find(".hotspot");
  spinnerElem.bind("onComplete.spritespin", function () {
    //   data = api.data;

    // prepend all hotspots on spinner init
    data.stage.prepend(hotspotsHTML);

    // initially show only those hotspots that exist on first frame
    data.stage.find(".hotspot").hide();
    data.stage.find(".hotspot-frame-0").fadeIn();
  }).bind("onAnimationStop.spritespin", function () {
    // get data for current state
    data = api.data;

    // show hotspots on current frame
    hotspotEl.hide();
    data.stage.find(".hotspot.hotspot-frame-" + data.frame).stop(false).fadeIn();
  });

  // Hide tooltip on close bttn
  hotspotEl.on('click', '.hotspot__tooltip-close', function (e) {
    hotspotEl.removeClass('is-active');
    spinnerModule.find('.js-hotspots-list-item').removeClass('is-active');
  });

  // Hide tooltip on hitting the Esc key
  $(document).keyup(function (e) {
    if (27 === e.keyCode) {
      hotspotEl.removeClass('is-active');
      spinnerModule.find('.js-hotspots-list-item').removeClass('is-active');
    }
  });

  // Hide tooltip on clicking outside of it
  $(document).on('click', function (e) {
    if (0 === $(e.target).closest($('.hotspot')).length && 0 === $(e.target).closest($('.hotspots-content')).length) {
      hotspotEl.removeClass('is-active');
      spinnerModule.find('.js-hotspots-list-item').removeClass('is-active');
    }
  });
}

/**
 * Add hotspots navigation
 */
function hotspotsNav(spinnerElem) {
  var spinnerModule = spinnerElem.closest('.m-image-spinner');
  if (!spinnerModule.attr('data-spinner-has-hotspots')) {
    return;
  }
  if (!spinnerModule.attr('data-hotspots-frames')) {
    return;
  }
  var hs_frames_list = spinnerModule.attr('data-hotspots-frames');
  var hs_frames = hs_frames_list.split(',');
  var hsContentList = spinnerModule.find('.js-hotspots-list');
  var hsContentListItem = hsContentList.find('.js-hotspots-list-item');
  var hotspotEl = spinnerModule.find('.hotspot');
  var api = spinnerElem.spritespin('api');
  var hotspots = [];
  var activeFrameIndex = api.data.frame;
  var activeHotspot, activeHotspotIndex;
  hs_frames.forEach(function (hs) {
    hotspots.push(parseInt(hs));
  });

  /**
   * Set active hotspot
   */
  function setActiveHotspot(activeHotspotIndex, deactivateHotspot) {
    // deactivate all hotspots
    hotspotEl.removeClass('is-active');
    hsContentListItem.removeClass('is-active');

    // if the hotspot is already active, close it
    if (deactivateHotspot) {
      return;
    }

    // get the new hotspot and its frame
    activeHotspot = api.data.stage.find(".hotspot.hotspot-index-" + activeHotspotIndex);
    activeFrameIndex = hotspots[activeHotspotIndex];

    // if the new hotspot is not the same frame,
    // hide all hotspots,
    // and navigate spinner to the according one
    if (activeFrameIndex - 1 !== api.data.frame) {
      hotspotEl.hide();
      api.playTo(activeFrameIndex - 1, {
        nearest: true
      });
    }

    // activate current hotspot and its content
    activeHotspot.addClass('is-active');
    hsContentList.find('.hs-index-' + activeHotspotIndex).addClass('is-active');
  }

  /**
   * Navigate through hotspots' pins
   */
  Array.from(hotspotEl).forEach(function (hs) {
    $(hs).on('click', '.js-hotspot-pin', function (e) {
      activeHotspotIndex = $(hs).attr('data-hotspot-index');
      activeHotspotIndex = parseInt(activeHotspotIndex);
      var deactivateHotspot = $(hs).hasClass('is-active');
      setActiveHotspot(activeHotspotIndex, deactivateHotspot);
    });
  });

  /**
   * Navigate through hotspots' content
   */
  Array.from(hsContentListItem).forEach(function (det) {
    $(det).on('click', function (e) {
      activeHotspotIndex = $(this).attr('data-hs-index');
      activeHotspotIndex = parseInt(activeHotspotIndex);
      var deactivateHotspot = $(this).hasClass('is-active');
      setActiveHotspot(activeHotspotIndex, deactivateHotspot);
    });
  });

  /**
   * Prev/Next navigation
   */
  if (spinnerModule.attr('data-ctrl-hotspots-nav')) {
    var ctrlBttnPrevHotspot = spinnerModule.find('.js-image-spinner-hotspot-prev');
    var ctrlBttnNextHotspot = spinnerModule.find('.js-image-spinner-hotspot-next');
    activeFrameIndex = api.data.frame;
    ctrlBttnPrevHotspot.on('click', function (e) {
      activeHotspot = api.data.stage.find(".hotspot.is-active");
      if (0 < activeHotspot.length) {
        activeHotspotIndex = activeHotspot.attr('data-hotspot-index');
      } else {
        activeHotspotIndex = 0;
      }
      activeHotspotIndex = parseInt(activeHotspotIndex);
      activeHotspotIndex--;
      activeHotspotIndex = normalizeItemIndex(activeHotspotIndex, hotspots);
      setActiveHotspot(activeHotspotIndex);
    });
    ctrlBttnNextHotspot.on('click', function (e) {
      activeHotspot = api.data.stage.find(".hotspot.is-active");
      if (0 < activeHotspot.length) {
        activeHotspotIndex = activeHotspot.attr('data-hotspot-index');
      } else {
        activeHotspotIndex = hotspots.length;
      }
      activeHotspotIndex = parseInt(activeHotspotIndex);
      activeHotspotIndex++;
      activeHotspotIndex = normalizeItemIndex(activeHotspotIndex, hotspots);
      setActiveHotspot(activeHotspotIndex);
    });
  }
}

/*
function getObjKey(obj, value) {
    return Object.keys(obj).find(key => obj[key] === value);
}
*/

var registerHotSpotsPlugin = function registerHotSpotsPlugin(label) {
  SpriteSpin.registerPlugin(label, {
    onLoad: function onLoad(ev) {
      assignHotspots($(ev.target));
      hotspotsNav($(ev.target));
    }
  });
};


/***/ }),

/***/ "./assets/_src/js/library/3d-media/spinner-plugins/progress-fraction-plugin.js":
/*!*************************************************************************************!*\
  !*** ./assets/_src/js/library/3d-media/spinner-plugins/progress-fraction-plugin.js ***!
  \*************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "registerProgressFractionPlugin": function() { return /* binding */ registerProgressFractionPlugin; }
/* harmony export */ });
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "jquery");
/**
 * Image Spinner Plugin - dsProgressFraction
 */

function progressFraction(spinnerElem) {
  var api = spinnerElem.spritespin('api');
  var spinnerModule = spinnerElem.closest('.m-image-spinner');
  var spinnerFraction = spinnerModule.find('.image-spinner__fraction-current');
  var data = api.data;
  spinnerElem.bind("onFrame.spritespin", function () {
    data = api.data;
    spinnerFraction.text(data.frame + 1);
  });
}
var registerProgressFractionPlugin = function registerProgressFractionPlugin(label) {
  SpriteSpin.registerPlugin(label, {
    onLoad: function onLoad(ev) {
      progressFraction($(ev.target));
    }
  });
};


/***/ }),

/***/ "./assets/_src/js/library/animations/easings-es6.js":
/*!**********************************************************!*\
  !*** ./assets/_src/js/library/animations/easings-es6.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "easeInBack": function() { return /* binding */ easeInBack; },
/* harmony export */   "easeInBounce": function() { return /* binding */ easeInBounce; },
/* harmony export */   "easeInCirc": function() { return /* binding */ easeInCirc; },
/* harmony export */   "easeInCubic": function() { return /* binding */ easeInCubic; },
/* harmony export */   "easeInElastic": function() { return /* binding */ easeInElastic; },
/* harmony export */   "easeInExpo": function() { return /* binding */ easeInExpo; },
/* harmony export */   "easeInOutBack": function() { return /* binding */ easeInOutBack; },
/* harmony export */   "easeInOutBounce": function() { return /* binding */ easeInOutBounce; },
/* harmony export */   "easeInOutCirc": function() { return /* binding */ easeInOutCirc; },
/* harmony export */   "easeInOutCubic": function() { return /* binding */ easeInOutCubic; },
/* harmony export */   "easeInOutElastic": function() { return /* binding */ easeInOutElastic; },
/* harmony export */   "easeInOutExpo": function() { return /* binding */ easeInOutExpo; },
/* harmony export */   "easeInOutQuad": function() { return /* binding */ easeInOutQuad; },
/* harmony export */   "easeInOutQuart": function() { return /* binding */ easeInOutQuart; },
/* harmony export */   "easeInOutQuint": function() { return /* binding */ easeInOutQuint; },
/* harmony export */   "easeInOutSine": function() { return /* binding */ easeInOutSine; },
/* harmony export */   "easeInQuad": function() { return /* binding */ easeInQuad; },
/* harmony export */   "easeInQuart": function() { return /* binding */ easeInQuart; },
/* harmony export */   "easeInQuint": function() { return /* binding */ easeInQuint; },
/* harmony export */   "easeInSine": function() { return /* binding */ easeInSine; },
/* harmony export */   "easeOutBack": function() { return /* binding */ easeOutBack; },
/* harmony export */   "easeOutBounce": function() { return /* binding */ easeOutBounce; },
/* harmony export */   "easeOutCirc": function() { return /* binding */ easeOutCirc; },
/* harmony export */   "easeOutCubic": function() { return /* binding */ easeOutCubic; },
/* harmony export */   "easeOutElastic": function() { return /* binding */ easeOutElastic; },
/* harmony export */   "easeOutExpo": function() { return /* binding */ easeOutExpo; },
/* harmony export */   "easeOutQuad": function() { return /* binding */ easeOutQuad; },
/* harmony export */   "easeOutQuart": function() { return /* binding */ easeOutQuart; },
/* harmony export */   "easeOutQuint": function() { return /* binding */ easeOutQuint; },
/* harmony export */   "easeOutSine": function() { return /* binding */ easeOutSine; }
/* harmony export */ });
/**
 * https://github.com/janrembold/es6-easings
 *
 * usage : import {easeInOutQuad} from 'easings';
 */

var easeOutQuad = function easeOutQuad(t, b, c, d) {
  return -c * (t /= d) * (t - 2) + b;
};
var easeInQuad = function easeInQuad(t, b, c, d) {
  return c * (t /= d) * t + b;
};
var easeInOutQuad = function easeInOutQuad(t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t + b;
  return -c / 2 * (--t * (t - 2) - 1) + b;
};
var easeInCubic = function easeInCubic(t, b, c, d) {
  return c * (t /= d) * t * t + b;
};
var easeOutCubic = function easeOutCubic(t, b, c, d) {
  return c * ((t = t / d - 1) * t * t + 1) + b;
};
var easeInOutCubic = function easeInOutCubic(t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
  return c / 2 * ((t -= 2) * t * t + 2) + b;
};
var easeInQuart = function easeInQuart(t, b, c, d) {
  return c * (t /= d) * t * t * t + b;
};
var easeOutQuart = function easeOutQuart(t, b, c, d) {
  return -c * ((t = t / d - 1) * t * t * t - 1) + b;
};
var easeInOutQuart = function easeInOutQuart(t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
  return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
};
var easeInQuint = function easeInQuint(t, b, c, d) {
  return c * (t /= d) * t * t * t * t + b;
};
var easeOutQuint = function easeOutQuint(t, b, c, d) {
  return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
};
var easeInOutQuint = function easeInOutQuint(t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
  return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
};
var easeInSine = function easeInSine(t, b, c, d) {
  return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
};
var easeOutSine = function easeOutSine(t, b, c, d) {
  return c * Math.sin(t / d * (Math.PI / 2)) + b;
};
var easeInOutSine = function easeInOutSine(t, b, c, d) {
  return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
};
var easeInExpo = function easeInExpo(t, b, c, d) {
  return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
};
var easeOutExpo = function easeOutExpo(t, b, c, d) {
  return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
};
var easeInOutExpo = function easeInOutExpo(t, b, c, d) {
  if (t == 0) return b;
  if (t == d) return b + c;
  if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
  return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
};
var easeInCirc = function easeInCirc(t, b, c, d) {
  return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
};
var easeOutCirc = function easeOutCirc(t, b, c, d) {
  return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
};
var easeInOutCirc = function easeInOutCirc(t, b, c, d) {
  if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
  return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
};
var easeInElastic = function easeInElastic(t, b, c, d) {
  var s = 1.70158;
  var p = 0;
  var a = c;
  if (t == 0) return b;
  if ((t /= d) == 1) return b + c;
  if (!p) p = d * .3;
  if (a < Math.abs(c)) {
    a = c;
    var s = p / 4;
  } else var s = p / (2 * Math.PI) * Math.asin(c / a);
  return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
};
var easeOutElastic = function easeOutElastic(t, b, c, d) {
  var s = 1.70158;
  var p = 0;
  var a = c;
  if (t == 0) return b;
  if ((t /= d) == 1) return b + c;
  if (!p) p = d * .3;
  if (a < Math.abs(c)) {
    a = c;
    var s = p / 4;
  } else var s = p / (2 * Math.PI) * Math.asin(c / a);
  return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
};
var easeInOutElastic = function easeInOutElastic(t, b, c, d) {
  var s = 1.70158;
  var p = 0;
  var a = c;
  if (t == 0) return b;
  if ((t /= d / 2) == 2) return b + c;
  if (!p) p = d * (.3 * 1.5);
  if (a < Math.abs(c)) {
    a = c;
    var s = p / 4;
  } else var s = p / (2 * Math.PI) * Math.asin(c / a);
  if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
  return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
};
var easeInBack = function easeInBack(t, b, c, d) {
  var s = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1.70158;
  return c * (t /= d) * t * ((s + 1) * t - s) + b;
};
var easeOutBack = function easeOutBack(t, b, c, d) {
  var s = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1.70158;
  return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
};
var easeInOutBack = function easeInOutBack(t, b, c, d) {
  var s = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1.70158;
  if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
  return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
};
var easeInBounce = function easeInBounce(t, b, c, d) {
  return c - easeOutBounce(d - t, 0, c, d) + b;
};
var easeOutBounce = function easeOutBounce(t, b, c, d) {
  if ((t /= d) < 1 / 2.75) {
    return c * (7.5625 * t * t) + b;
  } else if (t < 2 / 2.75) {
    return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
  } else if (t < 2.5 / 2.75) {
    return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
  } else {
    return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b;
  }
};
var easeInOutBounce = function easeInOutBounce(t, b, c, d) {
  if (t < d / 2) return easeInBounce(t * 2, 0, c, d) * .5 + b;
  return easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
};

/***/ }),

/***/ "./assets/_src/js/library/animations/scroll-to.js":
/*!********************************************************!*\
  !*** ./assets/_src/js/library/animations/scroll-to.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "scrollToUtil": function() { return /* binding */ scrollToUtil; }
/* harmony export */ });
/**
 * TODO: rework it to use request animation frame
 * https://stackoverflow.com/questions/21474678/scrolltop-animation-without-jquery
 *
 * taken from
 * https://gist.github.com/andjosh/6764939
 * https://github.com/alvarotrigo/skrollTop.js/blob/master/skrollTop.js
 *
 */
Math.easeInOutCubic = function (t, b, c, d) {
  if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
  return c / 2 * ((t -= 2) * t * t + 2) + b;
};
var scrollToUtil = function scrollToUtil(params) {
  var element = typeof params.element !== 'undefined' ? params.element : window;
  var to = params.to;
  var duration = typeof params.duration !== 'undefined' ? params.duration : 250;
  var callback = typeof params.callback !== 'undefined' ? params.callback : null;
  var easing = typeof params.easing !== 'undefined' ? params.easing : Math.easeInOutCubic;
  var start = element !== window ? element.scrollTop : (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
  var change = to - start;
  var currentTime = 0;
  var increment = 16; //same amount of milliseconds as requestAnimationFrame

  var animateScroll = function animateScroll() {
    currentTime += increment;
    var easingValue = duration ? easing(currentTime, start, change, duration) : to;
    element.scrollTo(0, easingValue);
    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    } else if (callback) {
      callback();
    }
  };
  animateScroll();
};

/***/ }),

/***/ "./assets/_src/js/library/collapsers/ds_collapse.js":
/*!**********************************************************!*\
  !*** ./assets/_src/js/library/collapsers/ds_collapse.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ds_collapse": function() { return /* binding */ ds_collapse; }
/* harmony export */ });
/**
 * Collapse
 *
 * https://medium.com/dailyjs/mimicking-bootstraps-collapse-with-vanilla-javascript-b3bb389040e7
 */

var ds_collapse = function ds_collapse() {
  // Handler that uses various data-* attributes to trigger
  // specific actions, mimicing bootstraps attributes
  var triggers = Array.from(document.querySelectorAll('[data-toggle="collapse"]'));
  window.addEventListener('click', function (event) {
    var element = event.target;
    if (triggers.includes(element)) {
      event.preventDefault();
      var selector = element.getAttribute('data-target');
      var selectorTextClosed = element.getAttribute('data-text-closed');
      var selectorTextOpened = element.getAttribute('data-text-opened');
      collapse(selector, 'toggle');
      if (event.target.classList.contains('collapse-trigger--opened')) {
        event.target.classList.remove('collapse-trigger--opened');
        event.target.innerHTML = selectorTextClosed;
      } else {
        event.target.classList.add('collapse-trigger--opened');
        event.target.innerHTML = selectorTextOpened;
      }
    }
  }, false);
  var fnmap = {
    toggle: 'toggle',
    show: 'add',
    hide: 'remove'
  };
  var collapse = function collapse(selector, cmd) {
    var targets = Array.from(document.querySelectorAll(selector));
    targets.forEach(function (target) {
      target.classList[fnmap[cmd]]('is-show');
    });
  };
};


/***/ }),

/***/ "./assets/_src/js/library/collapsers/ds_gridderInit.js":
/*!*************************************************************!*\
  !*** ./assets/_src/js/library/collapsers/ds_gridderInit.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ds_gridderInit": function() { return /* binding */ ds_gridderInit; }
/* harmony export */ });
var ds_gridderInit = function ds_gridderInit() {
  var gridderElements = document.querySelectorAll('.js-gridder');
  if (gridderElements) {
    gridderElements.forEach(function (element) {
      var columns = Number(element.dataset.gridderColumns) || 3; // set default to 3
      var gap = Number(element.dataset.gridderGap) || 15; // set default to 15

      new GridderJS(element, {
        columns: columns,
        gap: gap
      });
    });
  }
};


/***/ }),

/***/ "./assets/_src/js/library/collapsers/ds_toggleElement.js":
/*!***************************************************************!*\
  !*** ./assets/_src/js/library/collapsers/ds_toggleElement.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ds_toggleElement": function() { return /* binding */ ds_toggleElement; }
/* harmony export */ });
/* harmony import */ var _utils_u_show_hide_display__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/u_show-hide-display */ "./assets/_src/js/utils/u_show-hide-display.js");
/**
 * Toggle element on click
 *
 * https://gomakethings.com/how-to-show-and-hide-elements-with-vanilla-javascript/
 */

var ds_toggleElement = function ds_toggleElement() {
  document.addEventListener('click', function (e) {
    if (e.target.matches('[data-js="toggle-element"]')) {
      e.preventDefault();

      // Get the content
      var content = document.querySelector(e.target.hash);
      if (!content) return;

      // Toggle the content
      (0,_utils_u_show_hide_display__WEBPACK_IMPORTED_MODULE_0__.u_toggleElem)(content);
    }
  }, false);
};


/***/ }),

/***/ "./assets/_src/js/library/counters/progress-counter.js":
/*!*************************************************************!*\
  !*** ./assets/_src/js/library/counters/progress-counter.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * DS Progress Counter  1.0.0
 *
 * Written on: March 02, 2022
 *
 */
var ProgressCircleCounter = /*#__PURE__*/function () {
  function ProgressCircleCounter(options) {
    _classCallCheck(this, ProgressCircleCounter);
    this.defaults = {
      selector: '.c-counter__progress',
      item: {
        svg: '.c-counter__circle',
        text: '.c-counter__text'
      },
      svgClasses: {
        complete: '.complete',
        incomplete: '.incomplete',
        percentage: '.percentage'
      },
      duration: 2000,
      delay: 10,
      once: true,
      start: 0,
      percentage: 50,
      data: {
        percentage: 'data-progress-percentage'
      }
    };
    this.configOptions = _objectSpread(_objectSpread({}, this.defaults), options || {});
    this.registerEventListeners();
  }
  _createClass(ProgressCircleCounter, [{
    key: "registerEventListeners",
    value: function registerEventListeners() {
      var _this = this;
      var elements = document.querySelectorAll(this.configOptions.selector);
      var intersectionSupported = this.intersectionListenerSupported();
      if (intersectionSupported) {
        var intersectObserver = new IntersectionObserver(this.animateElements.bind(this), {
          root: null,
          rootMargin: '20px',
          threshold: 0.5
        });
        elements.forEach(function (element) {
          intersectObserver.observe(element);
        });
      } else if (window.addEventListener) {
        this.animateLegacy(elements);
        window.addEventListener('scroll', function () {
          _this.animateLegacy(elements);
        }, {
          passive: true
        });
      }
    }
  }, {
    key: "animateLegacy",
    value: function animateLegacy(elements) {
      var _this2 = this;
      elements.forEach(function (element) {
        if (_this2.elementIsInView(element)) {
          _this2.animateElements([element]);
        }
      });
    }
  }, {
    key: "animateElements",
    value: function animateElements(elements, observer) {
      var _this3 = this;
      elements.forEach(function (element) {
        var elm = element.target || element;
        var elementConfig = _this3.parseConfig(elm);
        var elmText = element.target.querySelector(elementConfig.item.text);
        var elmSvg = element.target.querySelector(elementConfig.item.svg);
        var elmComplete = elmSvg.querySelector(elementConfig.svgClasses.complete);
        var elmPercentage = elmSvg.querySelector(elementConfig.svgClasses.percentage);
        var elmDashLength = Math.ceil(elmComplete.getTotalLength());
        var elmFill = parseFloat(elmDashLength - elementConfig.percentage * elmDashLength / 100, 5);
        if (elmPercentage) {
          elmPercentage.style.strokeDashoffset = elmFill;
          elmPercentage.style.strokeDasharray = elmDashLength;
          elementConfig.fillLength = elmFill;
        }
        if (elmComplete) {
          elmComplete.style.strokeDasharray = elmDashLength;
          elmComplete.style.strokeDashoffset = elmDashLength;
          elementConfig.dashLength = elmDashLength;
        }
        elmSvg.classList.remove('not-ready');

        // If duration is less than or equal zero, just format the 'end' value
        if (elementConfig.duration <= 0) {
          elmComplete.style.strokeDashoffset = elmFill;
          return elmText.innerHTML = parseInt(elementConfig.percentage);
        }
        if (!observer && !_this3.elementIsInView(element) || observer && element.intersectionRatio < 0.5) {
          var value = elementConfig.percentage < elementConfig.start ? elementConfig.percentage : elementConfig.start;
          elmComplete.style.strokeDashoffset = parseFloat(elmDashLength - value * elmDashLength / 100, 5);
          return elmText.innerHTML = parseInt(value);
        }

        // If duration is more than 0, then start the counter
        setTimeout(function () {
          return _this3.startCounter(elm, elmText, elmComplete, elementConfig);
        }, elementConfig.delay);
      });
    }
  }, {
    key: "startCounter",
    value: function startCounter(element, elementText, elementComplete, config) {
      var _this4 = this;
      // First, get the increments step
      var incrementsPerStep = (config.percentage - config.start) / (config.duration / config.delay);
      // Next, set the counter mode (Increment or Decrement)
      var countMode = 'inc';

      // Set mode to 'decrement' and 'increment step' to minus if start is larger than end
      if (config.start > config.percentage) {
        countMode = 'dec';
        incrementsPerStep *= -1;
      }

      // Next, determine the starting value
      var currentCount = this.parseValue(config.start);
      // And then print it's value to the page
      var currentFill = config.dashLength - config.start * config.dashLength / 100;

      // console.log(currentFill, ' current fill');

      elementText.innerHTML = parseInt(currentCount);
      elementComplete.style.strokeDashoffset = parseFloat(currentFill, 5);

      // If the config 'once' is true, then set the 'duration' to 0
      if (config.once === true) {
        element.setAttribute('data-progress-duration', 0);
      }

      // Now, start counting with counterWorker using Interval method based on delay
      var counterWorker = setInterval(function () {
        // First, determine the next value base on current value, increment value, and cound mode
        var nextNum = _this4.nextNumber(currentCount, incrementsPerStep, countMode);
        var nextFill = config.dashLength - nextNum * config.dashLength / 100;
        // console.log(nextFill, 'next fill');
        // Next, print that value to the page
        elementText.innerHTML = parseInt(nextNum);
        elementComplete.style.strokeDashoffset = parseFloat(nextFill, 5);
        // Now set that value to the current value, becouse it's already printed
        currentCount = nextNum;

        // If the value is larger or less than the 'end' (base on mode), then  print the end value and stop the Interval
        if (currentCount >= config.percentage && countMode === 'inc' || currentCount <= config.percentage && countMode === 'dec') {
          elementText.innerHTML = parseInt(config.percentage);
          elementComplete.style.strokeDashoffset = parseFloat(config.dashLength - config.percentage * config.dashLength / 100, 5);
          clearInterval(counterWorker);
        }
      }, config.delay);
    }
  }, {
    key: "parseConfig",
    value: function parseConfig(element) {
      var _this5 = this;
      var baseConfig = _objectSpread({}, this.configOptions);
      var configValues = [].filter.call(element.attributes, function (attr) {
        return /^data-progress-/.test(attr.name);
      });
      var elementConfig = {};
      configValues.forEach(function (e) {
        var name = e.name.replace('data-progress-', '').toLowerCase();
        // eslint-disable-next-line radix
        var value = name === 'duration' ? parseInt(_this5.parseValue(e.value) * 1000) : _this5.parseValue(e.value);
        elementConfig[name] = value;
      });
      elementConfig.percentage > 100 ? elementConfig.percentage = 100 : elementConfig.percentage;
      elementConfig.start < 0 ? elementConfig.start = 0 : elementConfig.start;
      return Object.assign(baseConfig, elementConfig);
    }

    /** This function is to get the next number */
  }, {
    key: "nextNumber",
    value: function nextNumber(number, steps) {
      var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'inc';
      // First, get the exact value from the number and step (int or float)
      number = this.parseValue(number);
      steps = this.parseValue(steps);

      // Last, get the next number based on current number, increment step, and count mode
      // Always return it as float
      return parseFloat(mode === 'inc' ? number + steps : number - steps);
    }

    /** This function is to get the parsed value */
  }, {
    key: "parseValue",
    value: function parseValue(data) {
      // If number with dot (.), will be parsed as float
      if (/^[0-9]+\.[0-9]+$/.test(data)) {
        return parseFloat(data);
      }
      // If just number, will be parsed as integer
      if (/^[0-9]+$/.test(data)) {
        return parseInt(data);
      }
      // If it's boolean string, will be parsed as boolean
      if (/^true|false/i.test(data)) {
        return /^true/i.test(data);
      }
      // Return it's value as default
      return data;
    }

    /** This function is to detect the element is in view or not. */
  }, {
    key: "elementIsInView",
    value: function elementIsInView(element) {
      var top = element.offsetTop;
      var left = element.offsetLeft;
      var width = element.offsetWidth;
      var height = element.offsetHeight;
      while (element.offsetParent) {
        element = element.offsetParent;
        top += element.offsetTop;
        left += element.offsetLeft;
      }
      return top >= window.pageYOffset && left >= window.pageXOffset && top + height <= window.pageYOffset + window.innerHeight && left + width <= window.pageXOffset + window.innerWidth;
    }

    /** Just some condition to check browser Intersection Support */
  }, {
    key: "intersectionListenerSupported",
    value: function intersectionListenerSupported() {
      return 'IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype;
    }
  }]);
  return ProgressCircleCounter;
}();
/* harmony default export */ __webpack_exports__["default"] = (ProgressCircleCounter);

/***/ }),

/***/ "./assets/_src/js/library/counters/purecounter.js":
/*!********************************************************!*\
  !*** ./assets/_src/js/library/counters/purecounter.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * DS Counter  1.0.0
 *
 * based on: https://github.com/srexi/purecounterjs
 * Written on: April 15, 2021
 *
 * USAGE:
 */
var PureCounter = /*#__PURE__*/function () {
  function PureCounter(options) {
    _classCallCheck(this, PureCounter);
    this.defaults = {
      start: 0,
      end: 100,
      duration: 2000,
      delay: 10,
      once: true,
      decimals: 0,
      legacy: true,
      currency: false,
      currencysymbol: false,
      separator: false,
      separatorsymbol: ',',
      selector: '.purecounter'
    };
    this.configOptions = Object.assign({}, this.defaults, options || {});
    this.registerEventListeners();
  }
  _createClass(PureCounter, [{
    key: "registerEventListeners",
    value: function registerEventListeners() {
      var _this = this;
      var elements = document.querySelectorAll(this.configOptions.selector);
      var intersectionSupported = this.intersectionListenerSupported();
      if (intersectionSupported) {
        var intersectObserver = new IntersectionObserver(this.animateElements.bind(this), {
          "root": null,
          "rootMargin": '20px',
          "threshold": 0.5
        });
        elements.forEach(function (element) {
          intersectObserver.observe(element);
        });
      } else {
        if (window.addEventListener) {
          this.animateLegacy(elements);
          window.addEventListener('scroll', function (e) {
            _this.animateLegacy(elements);
          }, {
            "passive": true
          });
        }
      }
    }
  }, {
    key: "animateLegacy",
    value: function animateLegacy(elements) {
      var _this2 = this;
      elements.forEach(function (element) {
        var config = _this2.parseConfig(element);
        if (config.legacy === true && _this2.elementIsInView(element)) {
          _this2.animateElements([element]);
        }
      });
    }
  }, {
    key: "animateElements",
    value: function animateElements(elements, observer) {
      var _this3 = this;
      elements.forEach(function (element) {
        var elm = element.target || element; // Just make sure which element will be used
        var elementConfig = _this3.parseConfig(elm); // Get config value on that element

        // If duration is less than or equal zero, just format the 'end' value
        if (elementConfig.duration <= 0) {
          return elm.innerHTML = _this3.formatNumber(elementConfig.end, elementConfig);
        }
        if (!observer && !_this3.elementIsInView(element) || observer && element.intersectionRatio < 0.5) {
          var value = elementConfig.start > elementConfig.end ? elementConfig.end : elementConfig.start;
          return elm.innerHTML = _this3.formatNumber(value, elementConfig);
        }

        // If duration is more than 0, then start the counter
        setTimeout(function () {
          return _this3.startCounter(elm, elementConfig);
        }, elementConfig.delay);
      });
    }
  }, {
    key: "startCounter",
    value: function startCounter(element, config) {
      var _this4 = this;
      // First, get the increments step
      var incrementsPerStep = (config.end - config.start) / (config.duration / config.delay);
      // Next, set the counter mode (Increment or Decrement)
      var countMode = 'inc';

      // Set mode to 'decrement' and 'increment step' to minus if start is larger than end
      if (config.start > config.end) {
        countMode = 'dec';
        incrementsPerStep *= -1;
      }

      // Next, determine the starting value
      var currentCount = this.parseValue(config.start);
      // And then print it's value to the page
      element.innerHTML = this.formatNumber(currentCount, config);

      // If the config 'once' is true, then set the 'duration' to 0
      if (config.once === true) {
        element.setAttribute('data-purecounter-duration', 0);
      }

      // Now, start counting with counterWorker using Interval method based on delay
      var counterWorker = setInterval(function () {
        // First, determine the next value base on current value, increment value, and cound mode
        var nextNum = _this4.nextNumber(currentCount, incrementsPerStep, countMode);
        // Next, print that value to the page
        element.innerHTML = _this4.formatNumber(nextNum, config);
        // Now set that value to the current value, becouse it's already printed
        currentCount = nextNum;

        // If the value is larger or less than the 'end' (base on mode), then  print the end value and stop the Interval
        if (currentCount >= config.end && countMode == 'inc' || currentCount <= config.end && countMode == 'dec') {
          element.innerHTML = _this4.formatNumber(config.end, config);
          clearInterval(counterWorker);
        }
      }, config.delay);
    }
  }, {
    key: "parseConfig",
    value: function parseConfig(element) {
      var _this5 = this;
      // First, we need to declare the base Config
      // This config will be used if the element doesn't have config
      var baseConfig = _objectSpread({}, this.configOptions);

      // Next, gett all 'data-precounter' attributes value. Store to array
      var configValues = [].filter.call(element.attributes, function (attr) {
        return /^data-purecounter-/.test(attr.name);
      });

      // Now, we create element config as an empty object
      var elementConfig = {};

      // And then, fill the element config based on config values
      configValues.forEach(function (e) {
        var name = e.name.replace('data-purecounter-', '').toLowerCase();
        var value = name == 'duration' ? parseInt(_this5.parseValue(e.value) * 1000) : _this5.parseValue(e.value);
        elementConfig[name] = value; // We will get an object
      });

      // Last marge base config with element config and return it as an object
      return Object.assign(baseConfig, elementConfig);
    }

    /** This function is to get the next number */
  }, {
    key: "nextNumber",
    value: function nextNumber(number, steps) {
      var mode = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'inc';
      // First, get the exact value from the number and step (int or float)
      number = this.parseValue(number);
      steps = this.parseValue(steps);

      // Last, get the next number based on current number, increment step, and count mode
      // Always return it as float
      return parseFloat(mode === 'inc' ? number + steps : number - steps);
    }

    /** This function is to convert number into currency format */
  }, {
    key: "convertToCurrencySystem",
    value: function convertToCurrencySystem(number, config) {
      var symbol = config.currencysymbol || "",
        // Set the Currency Symbol (if any)
        limit = config.decimals || 1,
        // Set the decimal limit (default is 1)
        number = Math.abs(Number(number)); // Get the absolute value of number

      // Set the value
      var value = number >= 1.0e+12 ? "".concat((number / 1.0e+12).toFixed(limit), " T") // Twelve zeros for Trillions
      : number >= 1.0e+9 ? "".concat((number / 1.0e+9).toFixed(limit), " B") // Nine zeros for Billions
      : number >= 1.0e+6 ? "".concat((number / 1.0e+6).toFixed(limit), " M") // Six zeros for Millions
      : number >= 1.0e+3 ? "".concat((number / 1.0e+12).toFixed(limit), " K") // Three zeros for Thausands
      : number.toFixed(limit); // If less than 1000, print it's value

      // Apply symbol before the value and return it as string
      return symbol + value;
    }

    /** This function is to get the last formated number */
  }, {
    key: "applySeparator",
    value: function applySeparator(value, config) {
      // If config separator is false, delete all separator
      if (!config.separator) {
        return value.replace(new RegExp(/,/gi, 'gi'), '');
      }

      // If config separator is true, then create separator
      return value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,").replace(new RegExp(/,/gi, 'gi'), config.separatorsymbol);
    }

    /** This function is to get formated number to be printed in the page */
  }, {
    key: "formatNumber",
    value: function formatNumber(number, config) {
      // This is the configuration for 'toLocaleString' method
      var strConfig = {
        minimumFractionDigits: config.decimals,
        maximumFractionDigits: config.decimals
      };
      // Set the number if it using currency, then convert. If doesn't, just parse it as float
      number = config.currency ? this.convertToCurrencySystem(number, config) : parseFloat(number);

      // Last, apply the number separator using number as string
      return this.applySeparator(number.toLocaleString(undefined, strConfig), config);
    }

    /** This function is to get the parsed value */
  }, {
    key: "parseValue",
    value: function parseValue(data) {
      // If number with dot (.), will be parsed as float
      if (/^[0-9]+\.[0-9]+$/.test(data)) {
        return parseFloat(data);
      }
      // If just number, will be parsed as integer
      if (/^[0-9]+$/.test(data)) {
        return parseInt(data);
      }
      // If it's boolean string, will be parsed as boolean
      if (/^true|false/i.test(data)) {
        return /^true/i.test(data);
      }
      // Return it's value as default
      return data;
    }

    /** This function is to detect the element is in view or not. */
  }, {
    key: "elementIsInView",
    value: function elementIsInView(element) {
      var top = element.offsetTop;
      var left = element.offsetLeft;
      var width = element.offsetWidth;
      var height = element.offsetHeight;
      while (element.offsetParent) {
        element = element.offsetParent;
        top += element.offsetTop;
        left += element.offsetLeft;
      }
      return top >= window.pageYOffset && left >= window.pageXOffset && top + height <= window.pageYOffset + window.innerHeight && left + width <= window.pageXOffset + window.innerWidth;
    }

    /** Just some condition to check browser Intersection Support */
  }, {
    key: "intersectionListenerSupported",
    value: function intersectionListenerSupported() {
      return 'IntersectionObserver' in window && 'IntersectionObserverEntry' in window && 'intersectionRatio' in window.IntersectionObserverEntry.prototype;
    }
  }]);
  return PureCounter;
}();
/* harmony default export */ __webpack_exports__["default"] = (PureCounter);

/***/ }),

/***/ "./assets/_src/js/library/lubricants/ds_filter_lubricants.js":
/*!*******************************************************************!*\
  !*** ./assets/_src/js/library/lubricants/ds_filter_lubricants.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ds_lubricants_filters": function() { return /* binding */ ds_lubricants_filters; }
/* harmony export */ });
/* provided dependency */ var jQuery = __webpack_require__(/*! jquery */ "jquery");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "jquery");
function countryAjaxCall(continent) {
  var ajaxData = {
    action: 'get_filtered_lubricants',
    continent: continent
  };
  jQuery.ajax({
    type: 'post',
    dataType: 'json',
    url: ds.ajax_url,
    data: ajaxData,
    success: function success(response) {
      if (response.success) {
        if (response.data.countries) {
          $('.js-country-filter').html(response.data.countries);
        }
      }
    }
  });
}
function lubricantsAjaxCall(country, type) {
  var ajaxData = {
    action: 'get_filtered_lubricants',
    country: country,
    type: type
  };
  jQuery.ajax({
    type: 'post',
    dataType: 'json',
    url: ds.ajax_url,
    data: ajaxData,
    success: function success(response) {
      if (response.success) {
        $('.js-lubricants-container').html(response.data.lubricants);
      }
    }
  });
}
function loadMoreAjaxCall(paged) {
  var ajaxData = {
    action: 'get_filtered_lubricants',
    paged: paged
  };
  jQuery.ajax({
    type: 'post',
    dataType: 'json',
    url: ds.ajax_url,
    data: ajaxData,
    success: function success(response) {
      if (response.success) {
        if (paged >= response.data.max_pages) {
          $('.load-more').hide();
        }
        $('.js-lubricants-container').append(response.data.lubricants);
      }
    }
  });
}
function ds_lubricants_filters() {
  $('.js-continent-select').on('change', function () {
    var continent = $('.js-continent-select').val();
    countryAjaxCall(continent);
  });
  $('.js-country-filter').on('change', '.js-country-select', function () {
    var country = $('.js-country-select').val();
    var type = $('.js-type-select').val();
    lubricantsAjaxCall(country, type);
  });
  $('.js-type-select').on('change', function () {
    var country = $('.js-country-select').val();
    var type = $('.js-type-select').val();
    console.log(country);
    console.log(type);
    lubricantsAjaxCall(country, type);
  });
  var currentPage = 1;
  $('.load-more').on('click', function () {
    currentPage++;
    loadMoreAjaxCall(currentPage);
  });
}

/***/ }),

/***/ "./assets/_src/js/library/media-controls/media-control.js":
/*!****************************************************************!*\
  !*** ./assets/_src/js/library/media-controls/media-control.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_u_object_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/u_object_extend */ "./assets/_src/js/utils/u_object_extend.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

var DSMPMediaControls = /*#__PURE__*/function () {
  function DSMPMediaControls(options) {
    _classCallCheck(this, DSMPMediaControls);
    this.defaults = {
      selector: '.js-video-init',
      wrapper: 'js-video-wrap',
      buttons: {
        play: '.btn-play',
        mute: '.btn-mute',
        close: '.btn-close'
      },
      classes: {
        pause: 'is-pause',
        playing: 'is-playing',
        sound: 'is-sound',
        mute: 'is-muted',
        parentPlay: 'is-video-playing',
        parentPause: 'is-video-paused',
        triggerAutoplay: 'js-trigger-autoplay'
      },
      controls: false
    };
    this.config = (0,_utils_u_object_extend__WEBPACK_IMPORTED_MODULE_0__.u_extendObject)(this.defaults, options);
    this.items = document.querySelectorAll(this.config.selector);
    this.isRemovedDecoration = false;
    this.init();
  }
  _createClass(DSMPMediaControls, [{
    key: "init",
    value: function init() {
      var self = this;
      self.bindTogglePlay = this.togglePlay.bind(this);
      self.bindToggleMute = this.toggleMute.bind(this);
      self.bindEndedVideo = this.endedVideo.bind(this);
      _toConsumableArray(self.items).forEach(function (video) {
        if (!self.config.controls) {
          video.controls = false;
        }
        var videoContainer = video.parentElement;
        videoContainer.classList.add(self.config.wrapper);
        var btnPlay = videoContainer.querySelector(self.config.buttons.play);
        var btnMute = videoContainer.querySelector(self.config.buttons.mute);

        // bind events to buttons

        if (btnPlay) {
          btnPlay.addEventListener('click', self.bindTogglePlay);
        }
        if (btnMute) {
          btnMute.addEventListener('click', self.bindToggleMute);
        }

        // bind event to video itself
        video.addEventListener('ended', self.bindEndedVideo, false);
        if (video.classList.contains(self.config.classes.triggerAutoplay)) {
          self.startPlay(video);
        }
      });
    }
  }, {
    key: "endedVideo",
    value: function endedVideo(ev) {
      var self = this;
      var video = ev.currentTarget;
      var parentWrap = video.closest('.' + self.config.wrapper);
      var btnPlay = parentWrap.querySelector(self.config.buttons.play);
      video.pause();
      video.currentTime = 0;
      btnPlay.classList.add(self.config.classes.pause);
      btnPlay.classList.remove(self.config.classes.playing);
      parentWrap.classList.remove(self.config.classes.parentPlay);
    }
  }, {
    key: "togglePlay",
    value: function togglePlay(ev) {
      var self = this;
      var elem = ev.currentTarget;
      var parentWrap = elem.closest('.' + self.config.wrapper);
      var video = parentWrap.querySelector(self.config.selector);
      if (video.paused || video.ended) {
        elem.classList.add(self.config.classes.playing);
        parentWrap.classList.add(self.config.classes.parentPlay);
        parentWrap.classList.remove(self.config.classes.parentPause);
        elem.classList.remove(self.config.classes.pause);
        if (video.closest('.m-accordion') && video.closest('.m-accordion').classList.contains('has-decoration')) {
          video.closest('.m-accordion').classList.remove('has-decoration');
          self.isRemovedDecoration = true;
        }
        video.play();
      } else {
        elem.classList.add(self.config.classes.pause);
        parentWrap.classList.add(self.config.classes.parentPause);
        parentWrap.classList.remove(self.config.classes.parentPlay);
        elem.classList.remove(self.config.classes.playing);
        if (self.isRemovedDecoration) {
          video.closest('.m-accordion').classList.add('has-decoration');
          self.isRemovedDecoration = false;
        }
        video.pause();
      }
    }
  }, {
    key: "toggleMute",
    value: function toggleMute(ev) {
      var self = this;
      var elem = ev.currentTarget;
      var parentWrap = elem.closest('.' + self.config.wrapper);
      var video = parentWrap.querySelector(self.config.selector);
      video.muted = !video.muted;
      if (video.muted) {
        elem.classList.add(self.config.classes.mute);
        elem.classList.remove(self.config.classes.sound);
      } else {
        elem.classList.add(self.config.classes.sound);
        elem.classList.remove(self.config.classes.mute);
      }
    }
  }, {
    key: "stopPlay",
    value: function stopPlay(elem) {
      var self = this;
      var video = elem;
      var videoContainer = video.parentElement;
      var btnPlay = videoContainer.querySelector(self.config.buttons.play);
      if (!video.paused || !video.ended) {
        btnPlay.classList.add(self.config.classes.pause);
        // vTag.parentElement.classList.add('is-video-paused');
        btnPlay.classList.remove(self.config.classes.playing);
        video.pause();
      }
    }
  }, {
    key: "startPlay",
    value: function startPlay(elem) {
      var self = this;
      var video = elem;
      var videoContainer = video.parentElement;
      var btnPlay = videoContainer.querySelector(self.config.buttons.play);
      if (video.paused || video.ended) {
        btnPlay.classList.add(self.config.classes.playing);
        /*vTag.parentElement.classList.add('is-video-playing');
        vTag.parentElement.classList.remove('is-video-paused');*/
        btnPlay.classList.remove(self.config.classes.pause);
        video.play();
      }
    }
  }]);
  return DSMPMediaControls;
}();
/* harmony default export */ __webpack_exports__["default"] = (DSMPMediaControls);

/***/ }),

/***/ "./assets/_src/js/library/openings/ds_filter_openings.js":
/*!***************************************************************!*\
  !*** ./assets/_src/js/library/openings/ds_filter_openings.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ds_openings_filters": function() { return /* binding */ ds_openings_filters; }
/* harmony export */ });
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "jquery");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
// Get page elements.
var jobTypeSelect = $('.js-job-type-select').length ? $('.js-job-type-select') : false,
  jobCatSelect = $('.js-job-cat-select').length ? $('.js-job-cat-select') : false,
  jobLocSelect = $('.js-job-loc-select').length ? $('.js-job-loc-select') : false,
  jobSearchForm = $('#openingsSearch').length ? $('#openingsSearch') : false,
  jobSearchInput = $('#openingsSearch input[type="search"]').length ? $('#openingsSearch input[type="search"]') : false,
  loadMoreBtn = $('.js-load-more a').length ? $('.js-load-more a') : false,
  nothingFound = $('.js-nothing-found').length ? $('.js-nothing-found') : false,
  no_results = $('.js-stop-all').length ? true : false;

// Define on page state of the items.
var ppp = $('.js-openings-container').attr('data-ppp') ? parseInt($('.js-openings-container').attr('data-ppp')) : 10,
  itemsNum = $('.js-openings-container .js-job-item').length ? $('.js-openings-container .js-job-item').length : 0,
  itemsVisible = $('.js-openings-container .js-job-item:visible').length ? $('.js-openings-container .js-job-item:visible').length : 0,
  jobType = jobTypeSelect ? jobTypeSelect.val() : '',
  jobCat = jobCatSelect ? jobCatSelect.val() : '',
  jobLoc = jobLocSelect ? jobLocSelect.val() : '',
  search = jobSearchInput ? jobSearchInput.val() : '';

// Define global application state.
var appState = {
  'ppp': ppp,
  'total': itemsNum,
  'visible': itemsVisible,
  'type': jobType,
  'cat': jobCat,
  'loc': jobLoc,
  'search': search
};

// Define initial application state.
var appStateInitial = {
  'ppp': ppp,
  'total': itemsNum,
  'visible': ppp,
  'type': '',
  'cat': '',
  'loc': '',
  'search': ''
};

// Search check if title matches any of the search words.
function SearchTitle(Title, Search) {
  // Return true if there is no search query.
  if (!Search) {
    return true;
  }

  // Convert both strings to lowercase for case-insensitive comparison
  var lowerTitle = Title.toLowerCase();
  var lowerSearch = Search.toLowerCase();

  // Split the search string into an array of words
  var searchWords = lowerSearch.split(' ');

  // Initialize a flag to false
  var containsSearchWord = false;

  // Loop through each word in the searchWords array
  var _iterator = _createForOfIteratorHelper(searchWords),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var word = _step.value;
      if (lowerTitle.includes(word)) {
        containsSearchWord = true;
        break;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return containsSearchWord;
}

// Filtering function.
function filterItems(appState) {
  var ppp = appState.ppp,
    total = appState.total,
    visible = appState.visible,
    type = appState.type && 'all' === appState.type.toLowerCase() ? '' : appState.type,
    cat = appState.cat && 'all' === appState.cat.toLowerCase() ? '' : appState.cat,
    loc = appState.loc && 'all' === appState.loc.toLowerCase() ? '' : appState.loc,
    search = appState.search;

  // If total & visible are less than ppp, set them to be the same ( total )
  if (ppp >= visible && ppp >= total) {
    visible = total;
  }

  // Hide load more button.
  if (loadMoreBtn.length) {
    loadMoreBtn.css('display', 'none');
    // Update load more button values.
    loadMoreBtn.attr('data-total', 0);
    loadMoreBtn.attr('data-visible', 0);
  }

  // Find items on a page.
  var itemsAll = $('.js-openings-container .js-job-item');

  // Loop trough items.
  itemsAll.each(function () {
    var thisItem = $(this),
      itemType = thisItem.attr('data-type'),
      itemCat = thisItem.attr('data-cat'),
      itemLoc = thisItem.attr('data-loc'),
      itemTitle = thisItem.find('.js-job-name').text(),
      itemActive = true;

    // Hide all items by default.
    thisItem.css('display', 'none');

    // Reset active class on all items.
    thisItem.removeClass('active');

    // Check if types match, and add active class if they do.
    if (type && type !== itemType) {
      itemActive = false;
    }
    // Check if cats match, and add active class if they do.
    if (cat && cat !== itemCat) {
      itemActive = false;
    }
    // Check if locs match, and add active class if they do.
    if (loc && loc !== itemLoc) {
      itemActive = false;
    }
    // Check if search term matches the title, and add active class if they do.
    if (search && !SearchTitle(itemTitle, search)) {
      itemActive = false;
    }
    // Add active class if item has any of the filtering conditions met.
    if (itemActive) {
      thisItem.addClass('active');
    }
  });

  // Next find all of the active items.
  var itemsActive = $('.js-openings-container .js-job-item.active'),
    itemsCounter = 1;

  // If items are active, check how much items do we need to show.
  if (itemsActive.length) {
    // Hide no results message by default,
    // we will show it later if needed.
    nothingFound.css('display', 'none');

    // Loop trough active items.
    itemsActive.each(function () {
      // Check if items should be visible or not.
      // Visible is defined by the app state.
      if (visible >= itemsCounter) {
        $(this).css('display', 'block');
        itemsCounter++;
      }
    });
    // Reset counter just in case.
    itemsCounter = 1;

    // Find all of the hidden items.
    var itemsActiveVisible = $('.js-openings-container .js-job-item.active:visible').length;

    // Set new total & visible,
    // based on the current visibility of the items.
    total = itemsActive.length, visible = itemsActiveVisible;

    // If total & visible are less than ppp, set visible to be the same as total.
    if (ppp >= visible && ppp >= total) {
      visible = total;
    }

    // Check how much items have we shown, and show "Load More" button again, if needed.
    if (loadMoreBtn.length && total > visible) {
      loadMoreBtn.css('display', 'inline-flex');
    }
  } else {
    // If there are no active items, that means that filtration didn't return us a valid results.
    // Set new total & visible items.
    total = 0, visible = 0;
    // Show "no results" div.
    nothingFound.css('display', 'block');
  }

  // Update load more button values.
  // Load more button will update app state later on.
  loadMoreBtn.attr('data-total', total);
  loadMoreBtn.attr('data-visible', visible);
}

// Reset select fields values.
function resetSelectFields() {
  jobTypeSelect.val('').trigger('change');
  jobCatSelect.val('').trigger('change');
  jobLocSelect.val('').trigger('change');
}
function ds_openings_filters() {
  // Bail ealry if any of the items are not present.
  if (!(jobTypeSelect || jobCatSelect || jobLocSelect || jobSearchForm || jobSearchInput)) {
    return;
  }

  // If there are no results, stop all.
  if (no_results) {
    return;
  }

  // On job type select change.
  jobTypeSelect.on('change', function () {
    appState.type = $(this).val();
    $(document).trigger('updateState');
  });

  // On job category select change.
  jobCatSelect.on('change', function () {
    appState.cat = $(this).val();
    $(document).trigger('updateState');
  });

  // On job location select change.
  jobLocSelect.on('change', function () {
    appState.loc = $(this).val();
    $(document).trigger('updateState');
  });

  // On job search form submit.
  jobSearchForm.on('submit', function (e) {
    var searchValue = $(this).find('input[type="search"]') ? $(this).find('input[type="search"]').val() : '';
    // Reset selection fields.
    resetSelectFields();
    // If there is no search value, set app state to initial state.
    if (!searchValue) {
      appState = appStateInitial;
      appState.search = '';
    } else {
      appState.search = searchValue;
    }
    // Update state.
    $(document).trigger('updateState');
    // Prevent form submission.
    e.preventDefault();
    return false;
  });

  // On job search input change.
  jobSearchInput.on('change', function () {
    var searchValue = $(this).val() ? $(this).val() : '';
    // Reset selection fields.
    resetSelectFields();
    // If there is no search value, set app state to initial state.
    if (!searchValue) {
      appState = appStateInitial;
      appState.search = '';
    } else {
      appState.search = searchValue;
    }
    $(document).trigger('updateState');
  });

  // On load more button click.
  if (loadMoreBtn.length) {
    loadMoreBtn.on('click', function (e) {
      var thisItem = $(this),
        totalItems = thisItem.attr('data-total') ? parseInt(thisItem.attr('data-total')) : 0,
        visibleItems = thisItem.attr('data-visible') ? parseInt(thisItem.attr('data-visible')) : 0;

      // Set new visible items
      visibleItems = appState.ppp + visibleItems;

      // If the max value is reached, set it to max.
      if (visibleItems > totalItems) {
        visibleItems = totalItems;
      }
      // Update state.
      appState.total = totalItems;
      appState.visible = visibleItems;
      $(document).trigger('updateState');
      e.preventDefault();
      return false;
    });
  }

  // On state update, run filtering.
  $(document).on('updateState', function () {
    filterItems(appState);
  });
}

/***/ }),

/***/ "./assets/_src/js/library/resources/ds_resources.js":
/*!**********************************************************!*\
  !*** ./assets/_src/js/library/resources/ds_resources.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ds_resources_data": function() { return /* binding */ ds_resources_data; }
/* harmony export */ });
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "jquery");
/* provided dependency */ var jQuery = __webpack_require__(/*! jquery */ "jquery");
var nothing_found = function nothing_found(search) {
  return "<div class=\"nothing-found\">Sorry, we couldn't find anything ".concat(search ? "with \u201D".concat(search, "\u201D") : '', "</div>");
};
function ds_data_sheet() {
  $('.js-sheets-language-select').on('change', function () {
    var sheetLang = $('.js-sheets-language-select').val();
    if (!sheetLang) {
      sheetLang = 'all';
    }
    dataSheetAjax(sheetLang, '');
    $('#data_sheets-search').val('');
  });
}
function dataSheetSearch() {
  $('#dataSheetSearch').on('submit', function (ev) {
    ev.preventDefault();
    var search = $('#data_sheets-search').val();
    dataSheetAjax('all', search);
    $('.js-sheets-language-select').val('');
  });
}
function dataSheetAjax(sheetLang, search) {
  var ajaxData = {
    action: 'get_filtered_resources',
    sheetLang: sheetLang,
    search: search
  };
  jQuery.ajax({
    type: 'post',
    dataType: 'json',
    url: ds.ajax_url,
    data: ajaxData,
    success: function success(response) {
      if (response.success) {
        if (response.data.datasheets) {
          $('.js-data-sheets-list').html(response.data.datasheets);
        } else {
          $('.js-data-sheets-list').html(nothing_found(search));
        }
      }
    }
  });
}
function ds_brochure() {
  $('.js-brochures-regions-select').on('change', function () {
    var brochureRegion = $('.js-brochures-regions-select').val();
    var brochureLang = $('.js-brochures-languages-select').val();
    if (!brochureRegion) {
      brochureRegion = 'all';
    }
    if (!brochureLang) {
      brochureLang = 'all';
    }
    brochureAjax(brochureRegion, brochureLang, '');
    $('#brochures-search').val('');
  });
  $('.js-brochures-languages-select').on('change', function () {
    var brochureRegion = $('.js-brochures-regions-select').val();
    var brochureLang = $('.js-brochures-languages-select').val();
    if (!brochureRegion) {
      brochureRegion = 'all';
    }
    if (!brochureLang) {
      brochureLang = 'all';
    }
    brochureAjax(brochureRegion, brochureLang, '');
    $('#brochures-search').val('');
  });
}
function brochureSearch() {
  $('#brochuresSearch').on('submit', function (ev) {
    ev.preventDefault();
    var search = $('#brochures-search').val();
    brochureAjax('all', 'all', search);
    $('.js-brochures-regions-select').val('');
    $('.js-brochures-languages-select').val('');
  });
}
function brochureAjax(brochureRegion, brochureLang, search) {
  var ajaxData = {
    action: 'get_filtered_resources',
    brochureRegion: brochureRegion,
    brochureLang: brochureLang,
    search: search
  };
  jQuery.ajax({
    type: 'post',
    dataType: 'json',
    url: ds.ajax_url,
    data: ajaxData,
    success: function success(response) {
      if (response.success) {
        if (response.data.brochures) {
          $('.js-brochures-list').html(response.data.brochures);
        } else {
          $('.js-brochures-list').html(nothing_found(search));
        }
      }
    }
  });
}
function ds_videos() {
  $('.js-videos-regions-select').on('change', function () {
    var videosRegion = $('.js-videos-regions-select').val();
    var videosLanguage = $('.js-videos-languages-select').val();
    if (!videosRegion) {
      videosRegion = 'all';
    }
    if (!videosLanguage) {
      videosLanguage = 'all';
    }
    videoAjax(videosRegion, videosLanguage, '');
    $('#videos-search').val('');
  });
  $('.js-videos-languages-select').on('change', function () {
    var videosRegion = $('.js-videos-regions-select').val();
    var videosLanguage = $('.js-videos-languages-select').val();
    if (!videosRegion) {
      videosRegion = 'all';
    }
    if (!videosLanguage) {
      videosLanguage = 'all';
    }
    videoAjax(videosRegion, videosLanguage, '');
    $('#videos-search').val('');
  });
}
function videosSearch() {
  $('#videosSearch').on('submit', function (ev) {
    ev.preventDefault();
    var search = $('#videos-search').val();
    videoAjax('all', 'all', search);
    $('.js-videos-regions-select').val('');
    $('.js-videos-languages-select').val('');
  });
}
function videoAjax(videosRegion, videosLanguage, search) {
  var ajaxData = {
    action: 'get_filtered_resources',
    videosRegion: videosRegion,
    videosLanguage: videosLanguage,
    search: search
  };
  jQuery.ajax({
    type: 'post',
    dataType: 'json',
    url: ds.ajax_url,
    data: ajaxData,
    success: function success(response) {
      if (response.success) {
        if (response.data.videos) {
          $('.js-videos-list').html(response.data.videos);
        } else {
          $('.js-videos-list').html(nothing_found(search));
        }
      }
    }
  });
}
function ds_resources_data() {
  ds_data_sheet();
  dataSheetSearch();
  ds_brochure();
  brochureSearch();
  ds_videos();
  videosSearch();
}

/***/ }),

/***/ "./assets/_src/js/library/sliders/slider-dsbls.js":
/*!********************************************************!*\
  !*** ./assets/_src/js/library/sliders/slider-dsbls.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _slider_options_autoplay__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./slider-options/autoplay */ "./assets/_src/js/library/sliders/slider-options/autoplay.js");
/* harmony import */ var _slider_options_lazy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./slider-options/lazy */ "./assets/_src/js/library/sliders/slider-options/lazy.js");
/* harmony import */ var _swiper_with_tabs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./swiper-with-tabs */ "./assets/_src/js/library/sliders/swiper-with-tabs.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/utils */ "./assets/_src/js/utils/utils.js");
/* harmony import */ var _slider_options_navigation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./slider-options/navigation */ "./assets/_src/js/library/sliders/slider-options/navigation.js");
/* harmony import */ var _utils_u_types__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils/u_types */ "./assets/_src/js/utils/u_types.js");
/* harmony import */ var _slider_options_loop__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./slider-options/loop */ "./assets/_src/js/library/sliders/slider-options/loop.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }







var DSMPSliderDSBLS = /*#__PURE__*/function () {
  function DSMPSliderDSBLS(sliderID) {
    _classCallCheck(this, DSMPSliderDSBLS);
    this.optionsDesktop = {};
    this.optionsMobile = {
      slideClass: 'js-dsbls-nav-item',
      pagination: {
        el: '.l-slider-nav__pagination',
        clickable: true
      }
    };
    this.optionsNav = {
      item: '.js-dsbls-nav-item',
      active: 'is-active',
      trigger: 'mouseover'
    };
    this.sliderNo = sliderID.replace('js-slider-dsbls-', '');
    this.sliderName = sliderID;
    this.sliderMobileName = sliderID.replace('js-slider-dsbls-', 'js-slider-dsbls-m-');
    this.sliderSel = "#".concat(this.sliderName);
    this.sliderMobileSel = "#".concat(this.sliderMobileName);
    this.optionsNav.element = this.sliderMobileSel;
    this.sliderElem = document.querySelector(this.sliderSel);
    this.sliderMobileElem = document.querySelector(this.sliderMobileSel);
    this.showMobile = (0,_utils_u_types__WEBPACK_IMPORTED_MODULE_5__.u_parseBool)(this.sliderElem.getAttribute('data-slider-is-mobile'));
    this.optionsNav.trigger = this.sliderElem.getAttribute('data-slider-trigger') || 'mouseover';
    this.isMobile = false;
    this.isDesktop = false;
    this.desktopInstance;
    this.mobileInstance;
    this.desktopTabs;
    this.init();
  }
  _createClass(DSMPSliderDSBLS, [{
    key: "init",
    value: function init() {
      var self = this;
      var currentWidth = window.innerWidth;
      var breakpoint = 1112;
      currentWidth < breakpoint ? self.isMobile = true : self.isDesktop = true;
      self.parseOptions();
      if (self.isMobile && self.showMobile) self.createMobile();
      if (self.isDesktop) self.createDesktop();
      window.addEventListener('resize', function () {
        self.throttleResize();
      });
      self.throttleResize = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_3__.u_throttled)(function () {
        self.resizeSlider();
      }, 350);
    }
  }, {
    key: "parseOptions",
    value: function parseOptions() {
      var self = this;
      if (self.isMobile && self.showMobile) {
        var basename = self.sliderMobileName;
        self.optionsMobile = (0,_slider_options_loop__WEBPACK_IMPORTED_MODULE_6__.isLoopOn)(self.sliderMobileElem, self.optionsMobile);
        self.optionsMobile = (0,_slider_options_autoplay__WEBPACK_IMPORTED_MODULE_0__.isAutoPlayOn)(self.sliderMobileElem, self.optionsMobile);
        self.optionsMobile = (0,_slider_options_lazy__WEBPACK_IMPORTED_MODULE_1__.isLazyLoadOn)(self.sliderMobileElem, self.optionsMobile);

        // .m-slider parent is hardcoded in isNavigationOn options
        self.optionsMobile = (0,_slider_options_navigation__WEBPACK_IMPORTED_MODULE_4__.isNavigationOn)(self.sliderMobileElem, self.optionsMobile, basename, self.sliderNo);
      }
      if (self.isDesktop) {
        var _basename = self.sliderName;
        self.optionsDesktop = (0,_slider_options_loop__WEBPACK_IMPORTED_MODULE_6__.isLoopOn)(self.sliderElem, self.optionsDesktop);
        self.optionsDesktop = (0,_slider_options_autoplay__WEBPACK_IMPORTED_MODULE_0__.isAutoPlayOn)(self.sliderElem, self.optionsDesktop);
        self.optionsDesktop = (0,_slider_options_lazy__WEBPACK_IMPORTED_MODULE_1__.isLazyLoadOn)(self.sliderElem, self.optionsDesktop);

        // .m-slider parent is hardcoded in isNavigationOn options
        self.optionsDesktop = (0,_slider_options_navigation__WEBPACK_IMPORTED_MODULE_4__.isNavigationOn)(self.sliderElem, self.optionsDesktop, _basename, self.sliderNo);
      }
    }
  }, {
    key: "createDesktop",
    value: function createDesktop() {
      var self = this;
      self.desktopInstance = new Swiper(self.sliderSel, self.optionsDesktop);
      if (self.desktopInstance.initialized) {
        self.desktopTabs = new _swiper_with_tabs__WEBPACK_IMPORTED_MODULE_2__["default"](self.desktopInstance, self.optionsNav);
      }
    }
  }, {
    key: "createMobile",
    value: function createMobile() {
      var self = this;
      self.mobileInstance = new Swiper(self.sliderMobileSel, self.optionsMobile);
    }
  }, {
    key: "resizeSlider",
    value: function resizeSlider() {
      var self = this;
      var newWidth = window.innerWidth;
      var breakpoint = 1112;
      if (newWidth < breakpoint) {
        if (!self.isMobile) {
          if (typeof self.desktopInstance !== "undefined") {
            self.desktopTabs.unbindTabs();
            self.desktopInstance.destroy();
            self.desktopInstance = undefined;
          }
          if (self.showMobile) {
            self.createMobile();
          }
          self.isDesktop = false;
          self.isMobile = true;
        }
      } else {
        if (!self.isDesktop) {
          if (typeof self.mobileInstance !== "undefined") {
            self.mobileInstance.destroy();
            self.mobileInstance = undefined;
          }
          self.createDesktop();
          self.isMobile = false;
          self.isDesktop = true;
        }
      }
    }
  }]);
  return DSMPSliderDSBLS;
}();
/* harmony default export */ __webpack_exports__["default"] = (DSMPSliderDSBLS);

/***/ }),

/***/ "./assets/_src/js/library/sliders/slider-options/autoplay.js":
/*!*******************************************************************!*\
  !*** ./assets/_src/js/library/sliders/slider-options/autoplay.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isAutoPlayOn": function() { return /* binding */ isAutoPlayOn; }
/* harmony export */ });
/**
 * AutoPlay Slider Options
 */

var isAutoPlayOn = function isAutoPlayOn(elem, options) {
  if (!elem) return options;
  var isAutoplay = elem.getAttribute('data-slider-autoplay');
  var isAutoplayDelay = elem.getAttribute('data-slider-autoplay-delay');
  if (isAutoplay === 'true') {
    options.autoplay = {};
    options.autoplay.disableOnInteraction = false;
    options.autoplay.delay = isAutoplayDelay ? parseInt(isAutoplayDelay, 10) : 3000;
  }
  var isSpeedOn = elem.getAttribute('data-slider-autoplay-speed');
  if (isSpeedOn) {
    options.speed = parseInt(isSpeedOn, 10);
  }
  return options;
};


/***/ }),

/***/ "./assets/_src/js/library/sliders/slider-options/autoplayObserver.js":
/*!***************************************************************************!*\
  !*** ./assets/_src/js/library/sliders/slider-options/autoplayObserver.js ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "autoplayObserver": function() { return /* binding */ autoplayObserver; }
/* harmony export */ });
/**
 * Autoplay only when in viewport
 */

var autoplayObserver = function autoplayObserver(items, name, sliders) {
  var observerCallback = function observerCallback(entries) {
    entries.forEach(function (entry) {
      var sIndex = parseInt(entry.target.getAttribute('id').replace("".concat(name, "-"), ''), 10);
      if (entry.intersectionRatio > 0) {
        sliders[sIndex].autoplay.start();
      } else {
        sliders[sIndex].autoplay.stop();
      }
    });
  };
  var observer = new IntersectionObserver(observerCallback);
  items.forEach(function (observe) {
    var target = document.querySelector("#".concat(observe.slider));
    observer.observe(target);
  });
};


/***/ }),

/***/ "./assets/_src/js/library/sliders/slider-options/breakpoints.js":
/*!**********************************************************************!*\
  !*** ./assets/_src/js/library/sliders/slider-options/breakpoints.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isBreakpointsOn": function() { return /* binding */ isBreakpointsOn; }
/* harmony export */ });
/**
 * Break Points Options
 */

var isBreakpointsOn = function isBreakpointsOn(elem, options) {
  if (!elem) return options;
  var columnsStr = elem.getAttribute('data-slider-columns');
  var noColumns = columnsStr.indexOf('.') >= 0 ? parseFloat(columnsStr) : parseInt(columnsStr, 10);
  var columnsGap = parseInt(elem.getAttribute('data-slider-columns-gap'), 10) || 30;
  var forceColumnsGap = elem.getAttribute('data-slider-force-columns-gap') == '1';
  if (noColumns) {
    options.slidesPerView = noColumns;
    options.breakpoints = {
      320: {
        slidesPerView: 1,
        spaceBetween: forceColumnsGap ? columnsGap : 20,
        pagination: {
          type: 'bullets'
        }
      },
      // 576: {
      //     slidesPerView: noColumns > 3 ? 2 : 1,
      //     spaceBetween: 20,
      // },

      1024: {
        slidesPerView: noColumns,
        spaceBetween: columnsGap,
        pagination: options.pagination
      }
    };
  }
  return options;
};


/***/ }),

/***/ "./assets/_src/js/library/sliders/slider-options/effects.js":
/*!******************************************************************!*\
  !*** ./assets/_src/js/library/sliders/slider-options/effects.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isEffectOn": function() { return /* binding */ isEffectOn; }
/* harmony export */ });
var isEffectOn = function isEffectOn(elem, options) {
  if (!elem) return options;
  var isEffect = elem.getAttribute('data-slider-effect-transition');
  options.effect = {};
  switch (isEffect) {
    case 'fade':
      options.effect = 'fade';
      options.fadeEffect = {};
      options.fadeEffect.crossFade = true;
      break;
    case 'cube':
      options.effect = 'cube';
      break;
    case 'coverflow':
      options.effect = 'coverflow';
      break;
    case 'cards':
      options.effect = 'cards';
      break;
    case 'flip':
      options.effect = 'flip';
      break;
  }
  return options;
};


/***/ }),

/***/ "./assets/_src/js/library/sliders/slider-options/lazy.js":
/*!***************************************************************!*\
  !*** ./assets/_src/js/library/sliders/slider-options/lazy.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isLazyLoadOn": function() { return /* binding */ isLazyLoadOn; }
/* harmony export */ });
/**
 * Lazy Load Slider Options
 *
 * TODO: missing option for data option, create preloader div via js, and change image src to data-src, right now all this done manually
 */

var isLazyLoadOn = function isLazyLoadOn(elem, options) {
  if (!elem) return options;

  //let isLazyLoad = elem.getAttribute('data-slider-lazy');

  options.preloadImages = false;
  options.lazy = {};
  options.lazy.loadPrevNext = true;
  options.loadOnTransitionStart = true;
  return options;
};


/***/ }),

/***/ "./assets/_src/js/library/sliders/slider-options/loop.js":
/*!***************************************************************!*\
  !*** ./assets/_src/js/library/sliders/slider-options/loop.js ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isLoopOn": function() { return /* binding */ isLoopOn; }
/* harmony export */ });
/**
 * Loop Slider Options
 */

var isLoopOn = function isLoopOn(elem, options) {
  if (!elem) return options;
  var isLoop = elem.getAttribute('data-slider-loop');
  if (isLoop === 'true') {
    options.loop = true;
  }
  return options;
};


/***/ }),

/***/ "./assets/_src/js/library/sliders/slider-options/navigation.js":
/*!*********************************************************************!*\
  !*** ./assets/_src/js/library/sliders/slider-options/navigation.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isNavigationOn": function() { return /* binding */ isNavigationOn; }
/* harmony export */ });
/**
 * Navigation Slider Options
 */

var isNavigationOn = function isNavigationOn(elem, options, basename, currentID) {
  var nextEl = '.swiper-button-next';
  var prevEl = '.swiper-button-prev';
  var nextID, prevID, sliderNext, sliderPrev;
  if (!elem) return options;
  var isNavigation = elem.getAttribute('data-slider-navigation');
  if (isNavigation) {
    options.navigation = {};
    if (basename && typeof currentID !== "undefined") {
      nextID = "".concat(basename, "-next-").concat(currentID);
      prevID = "".concat(basename, "-prev-").concat(currentID);
    }
    var sliderParent = elem.closest('.m-slider');
    if (sliderParent) {
      sliderNext = sliderParent.querySelector(nextEl);
      sliderPrev = sliderParent.querySelector(prevEl);
    }
    if (sliderNext && nextID) {
      sliderNext.setAttribute('id', nextID);
      options.navigation.nextEl = "#".concat(nextID);
    }
    if (sliderPrev && prevID) {
      sliderPrev.setAttribute('id', prevID);
      options.navigation.prevEl = "#".concat(prevID);
    }
    if (window.innerWidth < 1024) {
      elem.setAttribute('data-slider-navigation', 'outer-arrows');
    } else {
      elem.setAttribute('data-slider-navigation', isNavigation);
    }
  } else {
    options.navigation = false;
  }
  return options;
};


/***/ }),

/***/ "./assets/_src/js/library/sliders/slider-options/pagination.js":
/*!*********************************************************************!*\
  !*** ./assets/_src/js/library/sliders/slider-options/pagination.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "isPaginationOn": function() { return /* binding */ isPaginationOn; }
/* harmony export */ });
/* harmony import */ var _utils_u_types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/u_types */ "./assets/_src/js/utils/u_types.js");
/**
 * Pagination Slider Options
 */

var isPaginationOn = function isPaginationOn(elem, options) {
  if (!elem) return options;
  var isPagination = elem.getAttribute('data-slider-pagination');
  if (isPagination) {
    options.pagination = {};
    options.pagination.el = '.m-slider__pagination';
    var leadingZero = false;
    if (isPagination === 'combo' || isPagination === 'fraction') {
      leadingZero = (0,_utils_u_types__WEBPACK_IMPORTED_MODULE_0__.u_parseBool)(elem.getAttribute('data-slider-leading-zero')) || false;
    }
    switch (isPagination) {
      case 'progressbar':
        options.pagination.type = 'progressbar';
        break;
      case 'fraction':
        options.pagination.type = 'fraction';
        options.pagination.formatFractionCurrent = function (number) {
          if (leadingZero) {
            return number < 10 ? "0".concat(number) : number;
          }
          return number;
        };
        options.pagination.formatFractionTotal = function (number) {
          if (leadingZero) {
            return number < 10 ? "0".concat(number) : number;
          }
          return number;
        };
        break;
      case 'combo':
        options.pagination.type = 'custom';
        options.pagination.renderCustom = function (swiper, current, total) {
          var totalFormated = total;
          var currentFormated = current;
          var progress = parseFloat(current / total).toFixed(5);
          if (leadingZero) {
            totalFormated = total < 10 ? "0".concat(total) : total;
            currentFormated = current < 10 ? "0".concat(current) : current;
          }
          return "<div class=\"swiper-pagination-progressbar swiper-pagination-horizontal\" style=\"--data-current: ".concat(current, " ; --data-total: ").concat(total, "; --data-progress: ").concat(progress, "\">\n                                <span class=\"swiper-pagination-progressbar-fill\"></span>\n                            </div> \n                            <div class=\"swiper-pagination-fraction\">\n                              <span class=\"swiper-pagination-current\">").concat(currentFormated, "</span>/\n                              <span class=\"swiper-pagination-total\">").concat(totalFormated, "</span>\n                            </div>");
        };
        break;
      default:
        options.pagination.clickable = true;
    }
    if (isPagination === 'combo') {
      var pagination = elem.querySelector('.m-slider__pagination');
      if (pagination) {
        pagination.classList.add('has-combo-progress');
      }
    }
    if (window.innerWidth < 1024) {
      elem.setAttribute('data-slider-pagination', 'bullets');
      options.pagination.clickable = true;
    } else {
      elem.setAttribute('data-slider-pagination', isPagination);
    }
  } else {
    options.pagination = false;
  }
  return options;
};


/***/ }),

/***/ "./assets/_src/js/library/sliders/swiper-with-circular-tabs.js":
/*!*********************************************************************!*\
  !*** ./assets/_src/js/library/sliders/swiper-with-circular-tabs.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_u_object_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/u_object_extend */ "./assets/_src/js/utils/u_object_extend.js");
/* harmony import */ var _utils_u_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/u_types */ "./assets/_src/js/utils/u_types.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/utils */ "./assets/_src/js/utils/utils.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }



var SwiperWithCircularTabs = /*#__PURE__*/function () {
  function SwiperWithCircularTabs(swiper, options) {
    _classCallCheck(this, SwiperWithCircularTabs);
    this.defaults = {
      element: '.l-nav',
      item: '.c-nav__item',
      circle: '.c-slider-nav',
      trigger: 'click',
      classes: {
        active: 'is-active',
        right: 'is-right',
        left: 'is-left',
        top: 'is-top',
        middle: 'is-middle',
        bottom: 'is-bottom'
      },
      direction: false,
      // false: clockwise, true: anticlockwise
      position: 2,
      // position of start item, top: 1, right: 2, bottom: 3, left: 4
      arrange: 0,
      // arrange 0 = full circle, any other number means angle
      arrangeCentered: true,
      // force centered even if uneven no of items
      itemAlign: 'center',
      // center, inside, outside
      itemAngle: 0,
      rotateActive: false,
      offset: 0,
      // max 90, min -90
      symmetric: false,
      symmetricOrder: 'columns',
      // columns or rows
      data: {
        arrange: 'data-slider-circular-arrange',
        arrangeCentered: 'data-slider-circular-centered',
        position: 'data-slider-circular-position',
        itemAngle: 'data-slider-circular-angle',
        itemAlign: 'data-slider-circular-align-items',
        // parsed from backend also
        direction: 'data-slider-circular-item-direction',
        rotateActive: 'data-slider-circular-rotate-to-active',
        offset: 'data-slider-circular-offset',
        trigger: 'data-slider-circular-trigger',
        symmetric: 'data-slider-circular-symmetric',
        symmetricOrder: 'data-slider-circular-order'
      }
    };

    // if swiper is not initialized, end the script
    if (!swiper.initialized) {
      console.log('swiper not initialized');
      return;
    }
    this.swiper = swiper;
    this.config = (0,_utils_u_object_extend__WEBPACK_IMPORTED_MODULE_0__.u_extendObject)(this.defaults, options);
    this.selector = "".concat(this.config.element, " ").concat(this.config.item);
    this.container = document.querySelector(this.config.element);
    this.circle = this.container.querySelector(this.config.circle);
    this.items = document.querySelectorAll(this.selector);
    this.shift = 0;
    this.shiftSymmetric = 180;
    this.multiplier = this.items.length;
    this.numberOfItems = this.items.length;
    this.arrangeShift = 0;
    this.full = 360;
    this.arrangeIndex = 0;
    // reference to click function
    this.tabClicked = this.tabClick.bind(this);
    this.parseOptions();
    this.init();
  }
  _createClass(SwiperWithCircularTabs, [{
    key: "init",
    value: function init() {
      var self = this;
      self.getContainerRadius();
      self.getItemDimensions();
      // add event that catches slide changes
      self.swiperSlideChange();
      // bind events that catches tabs changes
      self.bindTabs();
      self.updateItemsPositions();
      self.container.style.setProperty('--navitems', self.numberOfItems);
      window.addEventListener('resize', (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.u_throttled)(function () {
        self.updateItemsPositions();
      }), 150);
    }
  }, {
    key: "bindTabs",
    value: function bindTabs() {
      var self = this;
      var elem = self.items;
      elem.forEach(function (tab) {
        tab.addEventListener(self.config.trigger, self.tabClicked, {
          passive: true
        });
        if (self.isTouch && self.config.trigger === 'mouseover') {
          tab.addEventListener('touchstart', self.tabClicked, {
            passive: true
          });
        }
      });
    }
  }, {
    key: "unbindTabs",
    value: function unbindTabs() {
      var self = this;
      var elem = self.items;
      elem.forEach(function (tab) {
        tab.removeEventListener(self.config.trigger, self.tabClicked);
        if (self.isTouch && self.config.trigger === 'mouseover') {
          tab.removeEventListener('touchstart', self.tabClicked);
        }
      });
    }
  }, {
    key: "tabClick",
    value: function tabClick(ev) {
      var self = this;
      var currentTab = ev.currentTarget;
      var elem = self.items;
      var clickedTab;
      elem.forEach(function (tab, i) {
        if (currentTab === tab) {
          clickedTab = i;
        }
        tab.classList.remove(self.config.classes.active);
      });
      currentTab.classList.add(self.config.classes.active);
      self.swiper.slideToLoop(clickedTab);
      self.container.style.setProperty('--cAItem', clickedTab);
      if (self.config.rotateActive) {
        self.updateItemsPositions(clickedTab);
      }
    }
  }, {
    key: "tabChange",
    value: function tabChange(index) {
      var self = this;
      var elem = self.items;
      elem.forEach(function (tab) {
        tab.classList.remove(self.config.classes.active);
      });
      elem.forEach(function (tab, i) {
        if (index === i) {
          tab.classList.add(self.config.classes.active);
        }
      });
      self.container.style.setProperty('--cAItem', index);
    }
  }, {
    key: "swiperSlideChange",
    value: function swiperSlideChange() {
      var self = this;
      self.swiper.on('slideChange', function () {
        var currentSlide = self.swiper.realIndex;
        self.tabChange(currentSlide);
        self.updateItemsPositions(currentSlide);
      });
    }
  }, {
    key: "updateItemsPositions",
    value: function updateItemsPositions(index) {
      var self = this;
      var elems = self.items;
      var ind;
      if (index == null) {
        ind = self.arrangeIndex;
      } else {
        ind = index;
      }
      var angle;
      var rotateShift = 0;
      if (self.config.rotateActive) {
        rotateShift = (ind - self.arrangeIndex) * self.config.itemAngle;
      }
      var arrangeShift = self.arrangeShift,
        multiplier = self.multiplier,
        full = self.full;
      var objClasses = Object.values(self.config.classes);
      elems.forEach(function (elem, i) {
        var currentIndex = i;
        var divider = Math.ceil(self.numberOfItems / 2);
        if (self.config.symmetric) {
          if (self.config.symmetricOrder === 'rows') {
            i % 2 === 0 ? currentIndex = i / 2 : currentIndex = (i - 1) / 2;
          }
          if (self.config.symmetricOrder === 'columns') {
            if (i > divider - 1) currentIndex = i - divider;
          }
        }
        if (self.config.direction) {
          angle = full * (currentIndex / multiplier) + self.shift - arrangeShift - rotateShift - self.config.offset;
        } else {
          angle = -full * (currentIndex / multiplier) + self.shift + arrangeShift + rotateShift + self.config.offset;
        }
        if (self.config.symmetric) {
          if (self.config.symmetricOrder === 'rows') {
            if (i % 2 === 1) angle = self.shiftSymmetric - angle;
          }
          if (self.config.symmetricOrder === 'columns') {
            if (i > divider - 1) angle = self.shiftSymmetric - angle;
          }
        }
        var cosine = parseFloat(Math.cos(angle * (Math.PI / 180)).toFixed(6));
        var sinus = parseFloat(Math.sin(angle * (Math.PI / 180)).toFixed(6));

        // eslint-disable-next-line no-nested-ternary
        var itemSideX = cosine === 0 ? self.config.classes.middle : cosine < 0 ? self.config.classes.left : self.config.classes.right;
        // eslint-disable-next-line no-nested-ternary
        var itemSideY = sinus === 0 ? self.config.classes.middle : sinus < 0 ? self.config.classes.top : self.config.classes.bottom;
        objClasses.forEach(function (classItems) {
          if (!(classItems === 'is-active' || classItems === itemSideY || classItems === itemSideX)) {
            elem.classList.remove(classItems);
          }
        });
        sinus === 0 ? elem.classList.add(itemSideY, itemSideX) : elem.classList.add(itemSideX, itemSideY);

        /* calculate actual height of rotated elements */
        if (self.config.itemAlign !== 'center') {
          var height = elem.offsetHeight;
          var width = elem.offsetWidth;
          var rHeight = parseFloat(Math.abs(cosine) * height + Math.abs(sinus) * width).toFixed(6);
          var rWidth = parseFloat(Math.abs(cosine) * width + Math.abs(sinus) * height).toFixed(6);
          elem.style.setProperty('--itemRH', "".concat(rHeight, "px"));
          elem.style.setProperty('--itemRW', "".concat(rWidth, "px"));
        }
        elem.style.setProperty('--az', "".concat(angle, "deg"));
      });
    }
  }, {
    key: "parseOptions",
    value: function parseOptions() {
      var self = this;
      /* parse arranging of items, center, or none */
      var arrange = self.container.getAttribute(self.config.data.arrange);
      /* parse position, top, left, right, bottom */
      self.config.position = parseInt(self.container.getAttribute(self.config.data.position), 10);

      /* parse angle */
      self.config.itemAngle = parseInt(self.container.getAttribute(self.config.data.itemAngle), 10) || self.config.itemAngle;
      /* parse alignment of items to circle, inside, outside or center */
      self.config.itemAlign = self.container.getAttribute(self.config.data.itemAlign) || self.config.itemAlign;
      self.config.direction = (0,_utils_u_types__WEBPACK_IMPORTED_MODULE_1__.u_parseBool)(self.container.getAttribute(self.config.data.direction)) || self.config.direction;
      /* parse direction, clockwise, anticlockwise */
      self.config.rotateActive = (0,_utils_u_types__WEBPACK_IMPORTED_MODULE_1__.u_parseBool)(self.container.getAttribute(self.config.data.rotateActive)) || self.config.rotateActive;
      /* parse offset, if you want to have items start
      from different angle from starting position */
      self.config.offset = parseInt(self.container.getAttribute(self.config.data.offset), 10) || self.config.offset;
      /* trigger method, click or mouseover */
      var trigger = self.container.getAttribute(self.config.data.trigger) || self.config.trigger;
      if (trigger === 'mouseover') {
        self.config.trigger = 'mouseover';
        self.config.rotateActive = false;
      }
      switch (self.config.position) {
        case 1:
          self.shift = -90;
          self.shiftSymmetric = 0;
          break;
        case 3:
          self.shift = 90;
          self.shiftSymmetric = 0;
          break;
        case 4:
          self.shift = 180;
          self.shiftSymmetric = 180;
          break;
        default:
          self.shift = 0;
          self.shiftSymmetric = 180;
      }
      var isSemiCircle = false;
      if (self.config.itemAngle && self.config.itemAngle * self.numberOfItems <= self.full && self.config.itemAngle > 15) {
        self.full = self.config.itemAngle;
        self.multiplier = 1;
        isSemiCircle = true;
      } else {
        self.config.itemAngle = self.full / self.numberOfItems;
      }
      if (arrange === 'center' && isSemiCircle) {
        /* parse force centered */
        self.config.arrangeCentered = (0,_utils_u_types__WEBPACK_IMPORTED_MODULE_1__.u_parseBool)(self.container.getAttribute(self.config.data.arrangeCentered));
        /* parse symmetric options */
        self.config.symmetric = (0,_utils_u_types__WEBPACK_IMPORTED_MODULE_1__.u_parseBool)(self.container.getAttribute(self.config.data.symmetric)) || self.config.symmetric;
        self.config.symmetricOrder = self.container.getAttribute(self.config.data.symmetricOrder) || self.config.symmetricOrder;
        if (self.config.symmetric) self.config.rotateActive = false;
        var divider = self.config.symmetric ? 4 : 2;
        self.arrangeIndex = (self.numberOfItems - 1) / divider;
        if (self.config.arrangeCentered) self.arrangeIndex = Math.floor(self.arrangeIndex);
        self.arrangeShift = self.arrangeIndex * self.config.itemAngle;
      }
      if (Math.abs(self.config.offset) > 90) {
        self.config.offset = 0;
      }
    }
  }, {
    key: "getContainerRadius",
    value: function getContainerRadius() {
      var self = this;
      var circle = self.circle;
      var observer = new ResizeObserver(function (entries) {
        entries.forEach(function (entry) {
          var pureradius = entry.contentRect.width / 2;
          var radius = entry.borderBoxSize[0].inlineSize / 2;
          entry.target.style.setProperty('--r', "".concat(pureradius.toFixed(), "px"));
          entry.target.style.setProperty('--rclean', "".concat(radius.toFixed(), "px"));
        });
      });
      observer.observe(circle);
    }
  }, {
    key: "getItemDimensions",
    value: function getItemDimensions() {
      var self = this;
      var elems = self.items;
      var observer = new ResizeObserver(function (entries) {
        entries.forEach(function (entry) {
          var _entry$contentRect = entry.contentRect,
            width = _entry$contentRect.width,
            height = _entry$contentRect.height;
          entry.target.style.setProperty('--itemH', "".concat(height, "px"));
          entry.target.style.setProperty('--itemW', "".concat(width, "px"));
        });
      });
      elems.forEach(function (elem) {
        observer.observe(elem);
      });
    }
  }]);
  return SwiperWithCircularTabs;
}();
/* harmony default export */ __webpack_exports__["default"] = (SwiperWithCircularTabs);

/***/ }),

/***/ "./assets/_src/js/library/sliders/swiper-with-tabs.js":
/*!************************************************************!*\
  !*** ./assets/_src/js/library/sliders/swiper-with-tabs.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_u_is_touch_device__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/u_is-touch-device */ "./assets/_src/js/utils/u_is-touch-device.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

var SwiperWithTabs = /*#__PURE__*/function () {
  function SwiperWithTabs(swiper, options) {
    _classCallCheck(this, SwiperWithTabs);
    this.defaults = {
      element: '.l-nav',
      item: '.c-nav__item',
      active: 'is-active',
      trigger: 'click'
    };
    this.isTouch = false;
    // util function to check for touch device
    this.isTouchDevice();

    // if swiper is not initialized, end the script
    if (!swiper.initialized) {
      console.log('swiper not initialized');
      return;
    }
    this.swiper = swiper;
    this.config = Object.assign({}, this.defaults, options || {});
    this.selector = "".concat(this.config.element, " ").concat(this.config.item);
    this.items = document.querySelectorAll(this.selector);

    // reference to click function
    this.tabClicked = this.tabClick.bind(this);
    this.init();
  }
  _createClass(SwiperWithTabs, [{
    key: "init",
    value: function init() {
      var self = this;
      // add event that catches slide changes
      self.swiperSlideChange();
      // bind events that catches tabs changes
      self.bindTabs();
    }
  }, {
    key: "bindTabs",
    value: function bindTabs() {
      var self = this;
      var elem = self.items;
      elem.forEach(function (tab) {
        tab.addEventListener(self.config.trigger, self.tabClicked, {
          passive: true
        });
        if (self.isTouch && self.config.trigger === 'mouseover') {
          tab.addEventListener('touchstart', self.tabClicked, {
            passive: true
          });
        }
      });
    }
  }, {
    key: "unbindTabs",
    value: function unbindTabs() {
      var self = this;
      var elem = self.items;
      elem.forEach(function (tab) {
        tab.removeEventListener(self.config.trigger, self.tabClicked);
        if (self.isTouch && self.config.trigger === 'mouseover') {
          tab.removeEventListener('touchstart', self.tabClicked);
        }
      });
    }
  }, {
    key: "tabClick",
    value: function tabClick(ev) {
      var self = this;
      var currentTab = ev.currentTarget;
      var elem = self.items;
      var clickedTab;
      elem.forEach(function (tab, i) {
        if (currentTab === tab) {
          clickedTab = i;
        }
        tab.classList.remove(self.config.active);
      });
      currentTab.classList.add(self.config.active);
      self.swiper.slideToLoop(clickedTab);
    }
  }, {
    key: "tabChange",
    value: function tabChange(index) {
      var self = this;
      var elem = self.items;
      elem.forEach(function (tab) {
        tab.classList.remove(self.config.active);
      });
      elem.forEach(function (tab, i) {
        if (index === i) {
          tab.classList.add(self.config.active);
        }
      });
    }
  }, {
    key: "isTouchDevice",
    value: function isTouchDevice() {
      var self = this;
      if ((0,_utils_u_is_touch_device__WEBPACK_IMPORTED_MODULE_0__.u_isTouchDevice)()) {
        self.isTouch = true;
      }
    }
  }, {
    key: "swiperSlideChange",
    value: function swiperSlideChange() {
      var self = this;
      self.swiper.on('slideChange', function () {
        var currentSlide = self.swiper.realIndex;
        self.tabChange(currentSlide);
      });
    }
  }]);
  return SwiperWithTabs;
}();
/* harmony default export */ __webpack_exports__["default"] = (SwiperWithTabs);

/***/ }),

/***/ "./assets/_src/js/library/tabs-accordions/DSMPAccordions.js":
/*!******************************************************************!*\
  !*** ./assets/_src/js/library/tabs-accordions/DSMPAccordions.js ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_u_object_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/u_object_extend */ "./assets/_src/js/utils/u_object_extend.js");
/* harmony import */ var _utils_u_slide_up_down__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/u_slide-up-down */ "./assets/_src/js/utils/u_slide-up-down.js");
/* harmony import */ var _utils_u_fade_in_out__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/u_fade-in-out */ "./assets/_src/js/utils/u_fade-in-out.js");
/* harmony import */ var _utils_u_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/u_types */ "./assets/_src/js/utils/u_types.js");
/* harmony import */ var _animations_scroll_to__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../animations/scroll-to */ "./assets/_src/js/library/animations/scroll-to.js");
/* harmony import */ var _animations_easings_es6__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../animations/easings-es6 */ "./assets/_src/js/library/animations/easings-es6.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }






var DSMPAccordions = /*#__PURE__*/function () {
  function DSMPAccordions(selector, options) {
    var _this = this;
    _classCallCheck(this, DSMPAccordions);
    // default wrapper value
    this.wrapper = '.js-acc-wrapper';
    this.defaults = {
      selectors: {
        item: '.js-acc-item',
        trigger: '.js-acc-button',
        content: '.js-acc-content'
      },
      gallery: {
        container: '.js-acc-gallery',
        item: '.js-acc-media'
      },
      classes: {
        active: 'is-active',
        focus: 'focus',
        display: 'block'
      },
      animation: {
        content: true,
        // true: use js , false: use css
        gallery: false // true: use js , false: use css
      },

      attr: {
        close: 'data-close',
        open: 'data-expand',
        gallery: 'data-gallery',
        startClosed: 'data-start-closed',
        animationContent: 'data-animation',
        animationGallery: 'data-gallery-animation',
        display: 'data-acc-display',
        scrollToView: 'data-scroll-to-view'
      },
      opt: {
        close: false,
        expand: false,
        hasGallery: false,
        startClosed: false,
        scrollToView: false
      },
      aria: {
        button: 'header',
        content: 'content'
      }
    };

    // breakpoints: {
    //     tablet: 1113,
    //         mobile: 769,
    // },

    this.config = (0,_utils_u_object_extend__WEBPACK_IMPORTED_MODULE_0__.u_extendObject)(this.defaults, options);
    // check if we changed selector
    if (typeof selector !== "undefined") {
      this.wrapper = selector;
    }

    // get name to use for aria id's and controls
    this.getAriaName();
    this.selector = document.querySelector(this.wrapper);
    this.eventsListeners = {};
    this.parseOptions();
    this.shouldScroll = false;
    this.mql = window.matchMedia('(max-width: 1113px)');
    if (this.config.opt.scrollToView) {
      this.shouldScroll = this.mql.matches;
      this.mql.addEventListener('change', function (e) {
        _this.shouldScroll = e.matches;
      });
    }
    this.trigger = this.selector.querySelectorAll(this.config.selectors.trigger);
    this.items = this.selector.querySelectorAll(this.config.selectors.item);
    if (this.config.opt.hasGallery) {
      this.galleryItems = this.selector.querySelectorAll(this.config.gallery.item);
    }

    // array for stashing reference to binded events
    this.handlers = [];
    this.previousIndex = 0;
    this.currentIndex = 0;
    this.init();
  }
  _createClass(DSMPAccordions, [{
    key: "init",
    value: function init() {
      this.addAria();
      this.prepareForAnimation();
      this.accordionBindEvents();
    }
  }, {
    key: "reInit",
    value: function reInit() {
      this.accordionUnbindEvents();
      this.trigger = this.selector.querySelectorAll(this.config.selectors.trigger);
      this.items = this.selector.querySelectorAll(this.config.selectors.item);
      this.handlers = [];
      this.addAria();
      this.reInitAnimation();
      this.accordionBindEvents();
    }
  }, {
    key: "on",
    value: function on(events, callback) {
      var self = this;
      if (typeof callback !== 'function') return;
      events.split(' ').forEach(function (event, i) {
        if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
        self.eventsListeners[event].push(callback);
      });
    }
  }, {
    key: "off",
    value: function off(events, handler) {
      var self = this;
      if (!self.eventsListeners) return;
      events.split(' ').forEach(function (event) {
        if (typeof handler === 'undefined') {
          self.eventsListeners[event] = [];
        } else if (self.eventsListeners[event]) {
          self.eventsListeners[event].forEach(function (eventHandler, index) {
            if (eventHandler === handler) {
              self.eventsListeners[event].splice(index, 1);
            }
          });
        }
      });
    }
  }, {
    key: "emit",
    value: function emit() {
      var self = this;
      if (!self.eventsListeners) return self;
      var events;
      var data;
      var context;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      if (typeof args[0] === 'string' || Array.isArray(args[0])) {
        events = args[0];
        data = args.slice(1, args.length);
        context = self;
      } else {
        events = args[0].events;
        data = args[0].data;
        context = args[0].context || self;
      }

      //console.log(events, data, context);
      data.unshift(context);
      var eventsArray = Array.isArray(events) ? events : events.split(' ');
      eventsArray.forEach(function (event) {
        if (self.eventsListeners && self.eventsListeners[event]) {
          self.eventsListeners[event].forEach(function (eventHandler) {
            eventHandler.apply(context, data);
          });
        }
      });
    }
  }, {
    key: "accordionBindEvents",
    value: function accordionBindEvents() {
      var self = this;
      var elem = self.trigger;
      self.addListenerFocus = self.addListenerFocus.bind(self);
      self.addListenerBlur = self.addListenerBlur.bind(self);
      self.addKeyListener = self.addKeyListener.bind(self);
      self.on = self.on.bind(self);
      self.off = self.off.bind(self);
      self.emit = self.emit.bind(self);
      elem.forEach(function (acc, i) {
        var handlerFunc = self.accordionNavClick.bind(self, i);
        self.handlers.push(handlerFunc);
        acc.addEventListener('click', handlerFunc, {
          passive: true
        });
        acc.addEventListener('focus', self.addListenerFocus, {
          passive: true
        });
        acc.addEventListener('blur', self.addListenerBlur, {
          passive: true
        });
      });
      var accordion = self.selector;
      accordion.addEventListener('keydown', self.addKeyListener, {
        passive: true
      });
    }
  }, {
    key: "accordionUnbindEvents",
    value: function accordionUnbindEvents() {
      var self = this;
      var elem = self.trigger;
      elem.forEach(function (acc, i) {
        var elemParent = acc.closest(self.config.selectors.item);
        var elemContent = elemParent.querySelector(self.config.selectors.content);
        var control, header;
        if (self.config.aria.name) {
          control = "".concat(self.config.aria.name, "-").concat(self.config.aria.content, "-").concat(i);
          header = "".concat(self.config.aria.name, "-").concat(self.config.aria.button, "-").concat(i);
        }
        acc.removeAttribute('aria-expanded', '');
        if (elemContent) {
          elemContent.removeAttribute('aria-hidden', '');
        }
        if (self.config.aria.name) {
          acc.removeAttribute('aria-controls', '');
          acc.removeAttribute('id', '');
          if (elemContent) {
            elemContent.removeAttribute('id', '');
            elemContent.removeAttribute('aria-labelledby', '');
          }
        }
        if (elemContent) {
          elemContent.removeAttribute('role', '');
        }
        acc.removeEventListener('click', self.handlers[i]);
        acc.removeEventListener('focus', self.addListenerFocus);
        acc.removeEventListener('blur', self.addListenerBlur);
      });
      var accordion = self.selector;
      accordion.removeEventListener('keydown', self.addKeyListener);
      self.removeStyles();
    }
  }, {
    key: "accordionNavClick",
    value: function accordionNavClick(i, ev) {
      var self = this;
      var currentItemClicked = ev.currentTarget;
      self.accordionContentchange(i, currentItemClicked, ev);
    }
  }, {
    key: "accordionContentchange",
    value: function accordionContentchange(i, elem, ev) {
      var self = this;
      var currentItemClicked = elem;
      var elems = self.items;
      var currentItem = currentItemClicked.closest(self.config.selectors.item);
      var currentItemContent = currentItem.querySelector(self.config.selectors.content);
      var expanded = currentItemClicked.getAttribute('aria-expanded') === 'true' || false;
      if (currentItem.classList.contains(self.config.classes.active)) {
        if (self.config.opt.close) {
          if (self.config.animation.content) {
            (0,_utils_u_slide_up_down__WEBPACK_IMPORTED_MODULE_1__.u_slideUp)(currentItemContent, {
              display: self.config.classes.display
            });
          }
          currentItem.classList.remove(self.config.classes.active);
          currentItemClicked.setAttribute('aria-expanded', !expanded);
          currentItemContent.setAttribute('aria-hidden', expanded);
        }
      } else {
        if (!self.config.opt.expand) {
          elems.forEach(function (item) {
            var itemContent = item.querySelector(self.config.selectors.content);
            var itemTrigger = item.querySelector(self.config.selectors.trigger);
            if (self.config.animation.content) {
              (0,_utils_u_slide_up_down__WEBPACK_IMPORTED_MODULE_1__.u_slideUp)(itemContent, {
                display: self.config.classes.display
              });
            }
            item.classList.remove(self.config.classes.active);
            if (itemTrigger) {
              itemTrigger.setAttribute('aria-expanded', expanded);
            }
            if (itemContent) {
              itemContent.setAttribute('aria-hidden', !expanded);
            }
          });
          if (self.config.animation.content) {
            (0,_utils_u_slide_up_down__WEBPACK_IMPORTED_MODULE_1__.u_slideDown)(currentItemContent, {
              display: self.config.classes.display
            });
          }
          currentItem.classList.add(self.config.classes.active);
          currentItemClicked.setAttribute('aria-expanded', !expanded);
          currentItemContent.setAttribute('aria-hidden', expanded);
        } else {
          if (self.config.animation.content) {
            (0,_utils_u_slide_up_down__WEBPACK_IMPORTED_MODULE_1__.u_slideDown)(currentItemContent, {
              display: self.config.classes.display
            });
          }
          currentItem.classList.add(self.config.classes.active);
          currentItemClicked.setAttribute('aria-expanded', !expanded);
          currentItemContent.setAttribute('aria-hidden', expanded);
        }
        if (self.config.opt.hasGallery) {
          self.accordionChangeGallery(i);
        }
        if (self.shouldScroll && self.currentIndex < i) {
          self.scrollToAccordion(i);
        }
      }
      this.previousIndex = this.currentIndex;
      this.currentIndex = i;
      self.emit('accordionChange', ev);
    }
  }, {
    key: "nextAccordion",
    value: function nextAccordion() {
      var self = this;
      var nextElem = self.currentIndex;
      var numberOfElem = self.items.length;
      nextElem === numberOfElem - 1 ? nextElem = 0 : nextElem += 1;
      var nextElemItem = self.items[nextElem];
      self.accordionContentchange(nextElem, nextElemItem, null);
    }
  }, {
    key: "prevAccordion",
    value: function prevAccordion() {
      var self = this;
      var prevElem = self.currentIndex;
      var numberOfElem = self.items.length;
      prevElem === 0 ? prevElem = numberOfElem - 1 : prevElem -= 1;
      var prevElemItem = self.items[prevElem];
      self.accordionContentchange(prevElem, prevElemItem, null);
    }
  }, {
    key: "accordionChangeGallery",
    value: function accordionChangeGallery(i) {
      var self = this;
      var galleryItems = _toConsumableArray(self.galleryItems);
      galleryItems.forEach(function (gallery) {
        if (self.config.animation.gallery) {
          (0,_utils_u_fade_in_out__WEBPACK_IMPORTED_MODULE_2__.u_fadeOut)(gallery, {
            complete: function complete() {
              gallery.classList.remove(self.config.classes.active);
              var newItem = galleryItems[i];
              (0,_utils_u_fade_in_out__WEBPACK_IMPORTED_MODULE_2__.u_fadeIn)(newItem, {
                duration: 50
              });
              newItem.classList.add(self.config.classes.active);
            }
          });
        } else {
          gallery.classList.remove(self.config.classes.active);
        }
      });
      if (!self.config.animation.gallery) {
        galleryItems[i].classList.add(self.config.classes.active);
      }
    }
  }, {
    key: "prepareForAnimation",
    value: function prepareForAnimation() {
      /* check whether items contains is-active class, if its not start closed all,
      first item should have is-active class and its content should be set to
      display block / flex, otherwise, hide it
      */
      var self = this;
      var items = self.items;
      var index = 0;
      var activeFound = false;
      if (self.config.animation.content) {
        items.forEach(function (list, i) {
          var itemContent = list.querySelector(self.config.selectors.content);
          if (list.classList.contains(self.config.classes.active)) {
            if (!self.config.opt.startClosed) {
              if (itemContent) {
                itemContent.style.display = self.config.classes.display;
              }
            }
            index = i;
            activeFound = true;
          } else {
            if (itemContent) {
              itemContent.style.display = 'none';
            }
          }
        });
        if (!activeFound && !self.config.opt.startClosed) {
          var item0Content = items[0].querySelector(self.config.selectors.content);
          items[0].classList.add(self.config.classes.active);
          item0Content.style.display = self.config.classes.display;
        }
      }
    }
  }, {
    key: "reInitAnimation",
    value: function reInitAnimation() {
      var self = this;
      var items = self.items;
      if (self.config.animation.content) {
        items.forEach(function (list, i) {
          var itemContent = list.querySelector(self.config.selectors.content);
          if (!list.classList.contains(self.config.classes.active)) {
            itemContent.style.display = 'none';
          }
        });
      }
    }
  }, {
    key: "removeStyles",
    value: function removeStyles() {
      var self = this;
      var items = self.items;
      if (self.config.animation.content) {
        items.forEach(function (list, i) {
          var itemContent = list.querySelector(self.config.selectors.content);
          itemContent.style.display = '';
        });
      }
    }
  }, {
    key: "parseOptions",
    value: function parseOptions() {
      var self = this;
      var isSelfClose = (0,_utils_u_types__WEBPACK_IMPORTED_MODULE_3__.u_parseBool)(self.selector.getAttribute(self.config.attr.close)) || self.config.opt.close;
      if (isSelfClose) {
        isSelfClose ? self.config.opt.close = true : self.config.opt.close = false;
      }

      /**
       * if leave open is true, self close should automatically be true,
       * otherwise we wont be able to close on self click
       */

      var isLeaveOpen = (0,_utils_u_types__WEBPACK_IMPORTED_MODULE_3__.u_parseBool)(self.selector.getAttribute(self.config.attr.open)) || self.config.opt.expand;
      if (isLeaveOpen) {
        self.config.opt.expand = true;
        self.config.opt.close = true;
      } else {
        self.config.opt.expand = false;
      }
      var isStartClosed = (0,_utils_u_types__WEBPACK_IMPORTED_MODULE_3__.u_parseBool)(self.selector.getAttribute(self.config.attr.startClosed)) || self.config.opt.startClosed;
      if (isStartClosed) {
        self.config.opt.startClosed = true;
        self.config.opt.close = true;
      }
      var isGallery = (0,_utils_u_types__WEBPACK_IMPORTED_MODULE_3__.u_parseBool)(self.selector.getAttribute(self.config.attr.gallery)) || self.config.opt.hasGallery;
      if (isGallery) {
        self.config.opt.hasGallery = true;

        // if we have gallery, self close and expand is by default off
        self.config.opt.expand = false;
        self.config.opt.close = false;
        self.config.opt.startClosed = false;
      }
      var animateContent = self.selector.getAttribute(self.config.attr.animationContent);
      if (animateContent) {
        animateContent === 'js' ? self.config.animation.content = true : self.config.animation.content = false;
      }
      var animateGallery = self.selector.getAttribute(self.config.attr.animationGallery);
      if (animateGallery) {
        animateGallery === 'js' ? self.config.animation.gallery = true : self.config.animation.gallery = false;
      }
      var display = self.selector.getAttribute(self.config.attr.display) || self.config.classes.display;
      self.config.classes.display = display === 'flex' ? 'flex' : 'block';
      var isScrollToView = (0,_utils_u_types__WEBPACK_IMPORTED_MODULE_3__.u_parseBool)(self.selector.getAttribute(self.config.attr.scrollToView)) || self.config.opt.scrollToView;
      if (isScrollToView) {
        self.config.opt.scrollToView = true;
        self.config.opt.expand = false;
      }
      self.emit('optionsParsed');
    }

    // small function to check for valid ID of wrapper
  }, {
    key: "isValidId",
    value: function isValidId(s) {
      return /^[^\s]+$/.test(s);
    }
  }, {
    key: "getAriaName",
    value: function getAriaName() {
      var ariaName = this.wrapper.slice(1);
      if (this.isValidId(ariaName)) {
        this.config.aria.name = ariaName;
      } else {
        this.config.aria.name = false;
      }
    }
  }, {
    key: "addAria",
    value: function addAria() {
      var self = this;
      var elem = self.trigger;
      elem.forEach(function (acc, i) {
        var elemParent = acc.closest(self.config.selectors.item);
        var elemContent = elemParent.querySelector(self.config.selectors.content);
        var control, header;
        if (self.config.aria.name) {
          control = "".concat(self.config.aria.name, "-").concat(self.config.aria.content, "-").concat(i);
          header = "".concat(self.config.aria.name, "-").concat(self.config.aria.button, "-").concat(i);
        }
        if (elemParent.classList.contains(self.config.classes.active)) {
          acc.setAttribute('aria-expanded', true);
          if (elemContent) {
            elemContent.setAttribute('aria-hidden', false);
          }
        } else {
          acc.setAttribute('aria-expanded', false);
          if (elemContent) {
            elemContent.setAttribute('aria-hidden', true);
          }
        }
        if (self.config.aria.name) {
          acc.setAttribute('aria-controls', control);
          acc.setAttribute('id', header);
          if (elemContent) {
            elemContent.setAttribute('id', control);
            elemContent.setAttribute('aria-labelledby', header);
          }
        }
        if (elemContent) {
          elemContent.setAttribute('role', 'region');
        }
      });
    }
  }, {
    key: "addListenerFocus",
    value: function addListenerFocus(ev) {
      var self = this;
      var elem = ev.target;
      elem.classList.add(self.config.classes.focus);
    }
  }, {
    key: "addListenerBlur",
    value: function addListenerBlur(ev) {
      var self = this;
      var elem = ev.target;
      elem.classList.remove(self.config.classes.focus);
    }
  }, {
    key: "addKeyListener",
    value: function addKeyListener(ev) {
      var self = this;
      var elem = ev.target;
      var key = ev.which.toString();
      var triggers = _toConsumableArray(self.trigger);
      var triggerClass = self.config.selectors.trigger.slice(1);

      // 33 = Page Up, 34 = Page Down
      var ctrlModifier = ev.ctrlKey && key.match(/33|34/);
      if (elem.classList.contains(triggerClass)) {
        // Up/ Down arrow and Control + Page Up/ Page Down keyboard operations
        // 38 = Up, 40 = Down
        if (key.match(/38|40/) || ctrlModifier) {
          var index = triggers.indexOf(elem);
          var direction = key.match(/34|40/) ? 1 : -1;
          var length = triggers.length;
          var newIndex = (index + length + direction) % length;
          triggers[newIndex].focus();
        } else if (key.match(/35|36/)) {
          // 35 = End, 36 = Home keyboard operations
          switch (key) {
            // Go to first accordion
            case '36':
              triggers[0].focus();
              break;
            // Go to last accordion
            case '35':
              triggers[triggers.length - 1].focus();
              break;
          }
        }
      }
    }
  }, {
    key: "scrollToAccordion",
    value: function scrollToAccordion(currentIndex) {
      var self = this;
      var elem = self.trigger[0];
      var scrollCurrentContent = elem.getBoundingClientRect();
      var elemHeight = scrollCurrentContent.height;
      var offset = elemHeight * currentIndex;
      var currentScrollPos = window.scrollY || document.documentElement.scrollTop;
      var scrollTo = scrollCurrentContent.top + currentScrollPos + offset - 80;
      (0,_animations_scroll_to__WEBPACK_IMPORTED_MODULE_4__.scrollToUtil)({
        to: scrollTo,
        duration: 400,
        easing: _animations_easings_es6__WEBPACK_IMPORTED_MODULE_5__.easeInQuad
      });
    }
  }]);
  return DSMPAccordions;
}();
/* harmony default export */ __webpack_exports__["default"] = (DSMPAccordions);

/***/ }),

/***/ "./assets/_src/js/library/tabs-accordions/DSMPRetail-lubricants.js":
/*!*************************************************************************!*\
  !*** ./assets/_src/js/library/tabs-accordions/DSMPRetail-lubricants.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ds_retailLubricantsFilters": function() { return /* binding */ ds_retailLubricantsFilters; }
/* harmony export */ });
/* provided dependency */ var jQuery = __webpack_require__(/*! jquery */ "jquery");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "jquery");
function ajaxCall(type, segment, typeOfUse) {
  var ajaxData = {
    action: 'get_filtered_retail_lubricants',
    type: type,
    segment: segment,
    typeOfUse: typeOfUse
  };
  jQuery.ajax({
    type: 'post',
    dataType: 'json',
    url: ds.ajax_url,
    data: ajaxData,
    success: function success(response) {
      if (response.success) {
        console.log(response);
        $('.js-lubricants-container').html(response.data.html);
      }
    }
  });
}
function ds_retailLubricantsFilters() {
  $('.js-segment').on('change', function (event) {
    var type = event.target.dataset.type_id;
    var segment = event.target.value;
    var typeOfUse = $('.js-use').val();
    ajaxCall(type, segment, typeOfUse);
  });
  $('.js-use').on('change', function (ev) {
    var type = $('.js-segment').data('type_id');
    var typeOfUse = ev.target.value;
    var segment = $('.js-segment').val();
    ajaxCall(type, segment, typeOfUse);
  });
}

/***/ }),

/***/ "./assets/_src/js/library/tabs-accordions/DSMPTabs-dropdown.js":
/*!*********************************************************************!*\
  !*** ./assets/_src/js/library/tabs-accordions/DSMPTabs-dropdown.js ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DSMPTabsClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DSMPTabsClass */ "./assets/_src/js/library/tabs-accordions/DSMPTabsClass.js");
/* harmony import */ var _utils_u_object_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/u_object_extend */ "./assets/_src/js/utils/u_object_extend.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }
function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new TypeError('failed to set property'); } return value; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }


var DSMPTabsDropdown = /*#__PURE__*/function (_DSMPTabsClass) {
  _inherits(DSMPTabsDropdown, _DSMPTabsClass);
  var _super = _createSuper(DSMPTabsDropdown);
  function DSMPTabsDropdown(options) {
    var _this;
    _classCallCheck(this, DSMPTabsDropdown);
    _this = _super.call(this);
    _this.defaults = {
      wrapper: '.js-tabsDrop-wrapper',
      selectors: {
        dropdown: '.js-tabs-dropdown',
        panel: '.js-tabs-panel'
      },
      classes: {
        active: 'is-active'
      },
      data: 'data-tab',
      breakpoints: 'tablet' // tablet, desktop, desktop-l, all,  leave empty for disabled
    };

    _this.config = (0,_utils_u_object_extend__WEBPACK_IMPORTED_MODULE_1__.u_extendObject)(_this.defaults, options);
    _this.selectorDropdown = "".concat(_this.config.wrapper, " ").concat(_this.config.selectors.dropdown);
    _this.selectorPanels = "".concat(_this.config.wrapper, " ").concat(_this.config.selectors.panel);
    _this.itemsDropdown = document.querySelectorAll(_this.selectorDropdown);
    _this.panels = document.querySelectorAll(_this.selectorPanels);
    if (_this.config.breakpoints !== 'all') {
      _this.mql = window.matchMedia("(max-width: ".concat(_this.breakpoints[_this.config.breakpoints], "px)"));
      _this.mediaMatch = _this.mql.matches;
    } else {
      _this.mediaMatch = true;
    }
    if (!_this.itemsDropdown.length) return _possibleConstructorReturn(_this);
    _this.init();
    return _this;
  }
  _createClass(DSMPTabsDropdown, [{
    key: "init",
    value: function init() {
      this.bindFunctions();
      this.bindTabsDropdownEvent();
      _get(_getPrototypeOf(DSMPTabsDropdown.prototype), "bindTabPanelEvent", this).call(this);
    }
  }, {
    key: "bindFunctions",
    value: function bindFunctions() {
      this.tabDropdownChange = this.tabDropdownChange.bind(this);
      _set(_getPrototypeOf(DSMPTabsDropdown.prototype), "tabNavClick", _get(_getPrototypeOf(DSMPTabsDropdown.prototype), "tabNavClick", this).bind(this), this, true);
      _set(_getPrototypeOf(DSMPTabsDropdown.prototype), "mediaMatches", _get(_getPrototypeOf(DSMPTabsDropdown.prototype), "mediaMatches", this).bind(this), this, true);
      _set(_getPrototypeOf(DSMPTabsDropdown.prototype), "onSwipeStart", _get(_getPrototypeOf(DSMPTabsDropdown.prototype), "onSwipeStart", this).bind(this), this, true);
      _set(_getPrototypeOf(DSMPTabsDropdown.prototype), "onSwipeEnd", _get(_getPrototypeOf(DSMPTabsDropdown.prototype), "onSwipeEnd", this).bind(this), this, true);
      if (this.config.breakpoints !== 'all') {
        this.mql.addEventListener('change', _get(_getPrototypeOf(DSMPTabsDropdown.prototype), "mediaMatches", this));
      }
    }
  }, {
    key: "bindTabsDropdownEvent",
    value: function bindTabsDropdownEvent() {
      var self = this;
      var dropdowns = self.itemsDropdown;
      dropdowns.forEach(function (dropdown) {
        dropdown.addEventListener('change', self.tabDropdownChange);
      });
    }
  }, {
    key: "tabDropdownChange",
    value: function tabDropdownChange(ev) {
      var currDropdown = ev.currentTarget;
      var currentTabID = currDropdown.value;
      var currentIndex = currDropdown.options.selectedIndex;
      for (var i = 0; i < currDropdown.options.length; i += 1) {
        currDropdown.options[i].removeAttribute('selected');
      }
      currDropdown.options[currentIndex].setAttribute('selected', 'selected');
      _get(_getPrototypeOf(DSMPTabsDropdown.prototype), "tabPanelChange", this).call(this, currentTabID);
    }
  }, {
    key: "unbindTabsDropdownEvent",
    value: function unbindTabsDropdownEvent() {
      var self = this;
      var dropdowns = self.itemsDropdown;
      dropdowns.forEach(function (dropdown) {
        dropdown.removeEventListener('change', self.tabDropdownChange);
      });
    }
  }]);
  return DSMPTabsDropdown;
}(_DSMPTabsClass__WEBPACK_IMPORTED_MODULE_0__["default"]);
/* harmony default export */ __webpack_exports__["default"] = (DSMPTabsDropdown);

/***/ }),

/***/ "./assets/_src/js/library/tabs-accordions/DSMPTabs-tab.js":
/*!****************************************************************!*\
  !*** ./assets/_src/js/library/tabs-accordions/DSMPTabs-tab.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DSMPTabsClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DSMPTabsClass */ "./assets/_src/js/library/tabs-accordions/DSMPTabsClass.js");
/* harmony import */ var _utils_u_object_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/u_object_extend */ "./assets/_src/js/utils/u_object_extend.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }


var DSMPTabsTab = /*#__PURE__*/function (_DSMPTabsClass) {
  _inherits(DSMPTabsTab, _DSMPTabsClass);
  var _super = _createSuper(DSMPTabsTab);
  function DSMPTabsTab(options) {
    var _this;
    _classCallCheck(this, DSMPTabsTab);
    _this = _super.call(this);
    _this.defaults = {
      wrapper: '.js-tabs-wrapper',
      selectors: {
        nav: '.js-tabs-nav-item',
        panel: '.js-tabs-panel'
      },
      classes: {
        active: 'is-active'
      },
      data: 'data-tab',
      breakpoints: 'tablet' // tablet, desktop, desktop-l, all,  leave empty for disabled
    };

    _this.config = (0,_utils_u_object_extend__WEBPACK_IMPORTED_MODULE_1__.u_extendObject)(_this.defaults, options);
    _this.selector = "".concat(_this.config.wrapper, " ").concat(_this.config.selectors.nav);
    _this.selectorPanels = "".concat(_this.config.wrapper, " ").concat(_this.config.selectors.panel);
    _this.items = document.querySelectorAll(_this.selector);
    _this.panels = document.querySelectorAll(_this.selectorPanels);
    if (_this.config.breakpoints !== 'all') {
      _this.mql = window.matchMedia("(max-width: ".concat(_this.breakpoints[_this.config.breakpoints], "px)"));
      _this.mediaMatch = _this.mql.matches;
    } else {
      _this.mediaMatch = true;
    }
    if (!_this.items.length) return _possibleConstructorReturn(_this);
    _this.init();
    return _this;
  }
  _createClass(DSMPTabsTab, [{
    key: "init",
    value: function init() {
      _get(_getPrototypeOf(DSMPTabsTab.prototype), "unbindTabPanelEvent", this).call(this);
      _get(_getPrototypeOf(DSMPTabsTab.prototype), "unbindTabNavEvent", this).call(this);
      if (this.items.length > 0) {
        this.currentIndex = _get(_getPrototypeOf(DSMPTabsTab.prototype), "getNavTabID", this).call(this, this.items[0]);
      }
      _get(_getPrototypeOf(DSMPTabsTab.prototype), "bindFunctions", this).call(this);
      _get(_getPrototypeOf(DSMPTabsTab.prototype), "bindTabNavEvent", this).call(this);
      _get(_getPrototypeOf(DSMPTabsTab.prototype), "bindTabPanelEvent", this).call(this);
    }
  }]);
  return DSMPTabsTab;
}(_DSMPTabsClass__WEBPACK_IMPORTED_MODULE_0__["default"]);
/* harmony default export */ __webpack_exports__["default"] = (DSMPTabsTab);

/***/ }),

/***/ "./assets/_src/js/library/tabs-accordions/DSMPTabs-tabdropdown.js":
/*!************************************************************************!*\
  !*** ./assets/_src/js/library/tabs-accordions/DSMPTabs-tabdropdown.js ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_u_object_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/u_object_extend */ "./assets/_src/js/utils/u_object_extend.js");
/* harmony import */ var _DSMPTabsClass__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DSMPTabsClass */ "./assets/_src/js/library/tabs-accordions/DSMPTabsClass.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }
function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new TypeError('failed to set property'); } return value; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }


var DSMPTabsTabDropdown = /*#__PURE__*/function (_DSMPTabsClass) {
  _inherits(DSMPTabsTabDropdown, _DSMPTabsClass);
  var _super = _createSuper(DSMPTabsTabDropdown);
  function DSMPTabsTabDropdown(options) {
    var _this;
    _classCallCheck(this, DSMPTabsTabDropdown);
    _this = _super.call(this);
    _this.defaults = {
      wrapper: '.js-tabsTabDrop-wrapper',
      selectors: {
        nav: '.js-tabs-nav-item',
        dropdown: '.js-tabs-dropdown',
        panel: '.js-tabs-panel'
      },
      classes: {
        active: 'is-active'
      },
      data: 'data-tab',
      breakpoints: 'tablet' // tablet, desktop, desktop-l, all,  leave empty for disabled
    };

    _this.config = (0,_utils_u_object_extend__WEBPACK_IMPORTED_MODULE_0__.u_extendObject)(_this.defaults, options);
    _this.selectorTabs = "".concat(_this.config.wrapper, " ").concat(_this.config.selectors.nav);
    _this.selectorDropdown = "".concat(_this.config.wrapper, " ").concat(_this.config.selectors.dropdown);
    _this.selectorPanels = "".concat(_this.config.wrapper, " ").concat(_this.config.selectors.panel);
    _this.items = document.querySelectorAll(_this.selectorTabs);
    _this.itemsDropdown = document.querySelectorAll(_this.selectorDropdown);
    _this.panels = document.querySelectorAll(_this.selectorPanels);
    if (_this.config.breakpoints !== 'all') {
      _this.mql = window.matchMedia("(max-width: ".concat(_this.breakpoints[_this.config.breakpoints], "px)"));
      _this.mediaMatch = _this.mql.matches;
    } else {
      _this.mediaMatch = true;
    }
    if (!_this.items.length) return _possibleConstructorReturn(_this);
    _this.initTabsDropdown();
    return _this;
  }
  _createClass(DSMPTabsTabDropdown, [{
    key: "initTabsDropdown",
    value: function initTabsDropdown() {
      if (this.items.length > 0) {
        this.currentIndex = _get(_getPrototypeOf(DSMPTabsTabDropdown.prototype), "getNavTabID", this).call(this, this.items[0]);
        this.activeNav = this.items[0];
        this.activePanel = this.panels[0];
      }
      this.bindFunctions();
      this.bindTabNavEv();
      this.bindTabsDropdownEvent();
      _get(_getPrototypeOf(DSMPTabsTabDropdown.prototype), "bindTabPanelEvent", this).call(this);
    }
  }, {
    key: "bindFunctions",
    value: function bindFunctions() {
      this.tabDropdownChange = this.tabDropdownChange.bind(this);
      this.tabNavClick = this.tabNavClick.bind(this);
      this.mediaMatches = this.mediaMatches.bind(this);
      _set(_getPrototypeOf(DSMPTabsTabDropdown.prototype), "onSwipeStart", _get(_getPrototypeOf(DSMPTabsTabDropdown.prototype), "onSwipeStart", this).bind(this), this, true);
      _set(_getPrototypeOf(DSMPTabsTabDropdown.prototype), "onSwipeEnd", _get(_getPrototypeOf(DSMPTabsTabDropdown.prototype), "onSwipeEnd", this).bind(this), this, true);
      if (this.config.breakpoints !== 'all') {
        this.mql.addEventListener('change', this.mediaMatches);
      }
    }
  }, {
    key: "bindTabsDropdownEvent",
    value: function bindTabsDropdownEvent() {
      var self = this;
      var dropdowns = self.itemsDropdown;
      dropdowns.forEach(function (dropdown) {
        dropdown.addEventListener('change', self.tabDropdownChange);
      });
    }
  }, {
    key: "mediaMatches",
    value: function mediaMatches(e) {
      this.mediaMatch = e.matches;
      if (this.mediaMatch) {
        _get(_getPrototypeOf(DSMPTabsTabDropdown.prototype), "bindTabPanelEvent", this).call(this);
      } else {
        _get(_getPrototypeOf(DSMPTabsTabDropdown.prototype), "unbindTabPanelEvent", this).call(this);
      }
    }
  }, {
    key: "bindTabNavEv",
    value: function bindTabNavEv() {
      var self = this;
      var elem = self.items;
      elem.forEach(function (tab) {
        tab.addEventListener('click', self.tabNavClick, {
          passive: true
        });
      });
    }
  }, {
    key: "tabNavClick",
    value: function tabNavClick(ev) {
      var self = this;
      var currentTab = ev.currentTarget;
      var currentTabID = _get(_getPrototypeOf(DSMPTabsTabDropdown.prototype), "getNavTabID", this).call(this, currentTab);
      var currentSelector = currentTab.closest(self.config.wrapper);
      var currentDropdown = currentSelector.querySelector(self.config.selectors.dropdown);
      var newIndex;
      for (var i = 0; i < currentDropdown.options.length; i += 1) {
        if (currentDropdown.options[i].value === currentTabID) {
          newIndex = i;
        }
      }
      self.updateTabNav(currentTab);
      self.updateDropdown(currentDropdown, newIndex);
      _get(_getPrototypeOf(DSMPTabsTabDropdown.prototype), "tabPanelChange", this).call(this, currentTabID);
    }
  }, {
    key: "tabDropdownChange",
    value: function tabDropdownChange(ev) {
      var self = this;
      var currDropdown = ev.currentTarget;
      var currentIndex = currDropdown.options.selectedIndex;
      var currentTabID = currDropdown.value;
      var currentNavItem = document.querySelector("[".concat(self.config.data, "='").concat(currentTabID, "']"));
      self.updateDropdown(currDropdown, currentIndex);
      self.updateTabNav(currentNavItem);
      _get(_getPrototypeOf(DSMPTabsTabDropdown.prototype), "tabPanelChange", this).call(this, currentTabID);
    }
  }, {
    key: "updateDropdown",
    value: function updateDropdown(currentDrop, newDropIndex) {
      var self = this;
      var currDropdown = currentDrop;
      var currentIndex = newDropIndex;
      for (var i = 0; i < currDropdown.options.length; i += 1) {
        currDropdown.options[i].removeAttribute('selected');
      }
      currDropdown.options[currentIndex].setAttribute('selected', 'selected');
      currDropdown.options.selectedIndex = currentIndex;
    }
  }, {
    key: "updateTabNav",
    value: function updateTabNav(currTab) {
      var self = this;
      var currentTab = currTab;
      self.activeNav = currTab;
      var currentSelector = currentTab.closest(self.config.wrapper);
      var elem = currentSelector.querySelectorAll(self.config.selectors.nav);
      _get(_getPrototypeOf(DSMPTabsTabDropdown.prototype), "clearActiveClass", this).call(this, elem, 'nav');
      _get(_getPrototypeOf(DSMPTabsTabDropdown.prototype), "setActiveClass", this).call(this, currentTab, 'nav');
    }
  }, {
    key: "unbindTabsDropEvents",
    value: function unbindTabsDropEvents() {
      var self = this;
      var dropdowns = self.itemsDropdown;
      var elem = self.items;
      var panels = self.panels;
      elem.forEach(function (tab) {
        tab.removeEventListener('click', self.tabNavClick);
      });
      panels.forEach(function (panel) {
        panel.removeEventListener('mousedown', self.onSwipeStart);
        panel.removeEventListener('touchstart', self.onSwipeStart);
        panel.removeEventListener('mouseup', self.onSwipeEnd);
        panel.removeEventListener('touchend', self.onSwipeEnd);
      });
      dropdowns.forEach(function (dropdown) {
        dropdown.removeEventListener('change', self.tabDropdownChange);
      });
    }
  }, {
    key: "nextTab",
    value: function nextTab() {
      var self = this;
      var items = self.items;
      var currentItem = self.currentIndex;
      var numberOfElem = self.items.length;
      var foundIndex = 0;
      var nextElem;
      var currentTab = document.querySelector("[".concat(self.config.data, "='").concat(currentItem, "']"));
      var currentSelector = currentTab.closest(self.config.wrapper);
      var currentDropdown = currentSelector.querySelector(self.config.selectors.dropdown);
      items.forEach(function (item, i) {
        var itemID = self.getNavTabID(item);
        if (itemID === currentItem) {
          foundIndex = i;
        }
      });
      if (foundIndex < numberOfElem - 1) {
        self.changeActiveTab(foundIndex + 1);
        self.updateDropdown(currentDropdown, foundIndex + 1);
      }
    }
  }, {
    key: "prevTab",
    value: function prevTab() {
      var self = this;
      var items = self.items;
      var currentItem = self.currentIndex;
      var numberOfElem = self.items.length;
      var foundIndex = 0;
      var prevElem;
      var currentTab = document.querySelector("[".concat(self.config.data, "='").concat(currentItem, "']"));
      var currentSelector = currentTab.closest(self.config.wrapper);
      var currentDropdown = currentSelector.querySelector(self.config.selectors.dropdown);
      items.forEach(function (item, i) {
        var itemID = self.getNavTabID(item);
        if (itemID === currentItem) {
          foundIndex = i;
        }
      });
      if (foundIndex > 0) {
        self.changeActiveTab(foundIndex - 1);
        self.updateDropdown(currentDropdown, foundIndex - 1);
      }
    }
  }]);
  return DSMPTabsTabDropdown;
}(_DSMPTabsClass__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ __webpack_exports__["default"] = (DSMPTabsTabDropdown);

/***/ }),

/***/ "./assets/_src/js/library/tabs-accordions/DSMPTabsClass.js":
/*!*****************************************************************!*\
  !*** ./assets/_src/js/library/tabs-accordions/DSMPTabsClass.js ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var DSMPTabsClass = /*#__PURE__*/function () {
  function DSMPTabsClass() {
    _classCallCheck(this, DSMPTabsClass);
    this.eventsListeners = {};
    this.currentIndex = 0;
    this.activeNav = null;
    this.activePanel = null;
    this.breakpoints = {
      tablet: 768,
      desktop: 1112,
      'desktop-l': 1440
    };
    this.breakpoint = false;
  }
  _createClass(DSMPTabsClass, [{
    key: "bindFunctions",
    value: function bindFunctions() {
      this.tabNavClick = this.tabNavClick.bind(this);
      this.mediaMatches = this.mediaMatches.bind(this);
      this.onSwipeStart = this.onSwipeStart.bind(this);
      this.onSwipeEnd = this.onSwipeEnd.bind(this);
      if (this.config.breakpoints !== 'all') {
        this.mql.addEventListener('change', this.mediaMatches);
      }
    }
  }, {
    key: "mediaMatches",
    value: function mediaMatches(e) {
      this.mediaMatch = e.matches;
      if (this.mediaMatch) {
        this.bindTabPanelEvent();
      } else {
        this.unbindTabPanelEvent();
      }
    }
  }, {
    key: "bindTabNavEvent",
    value: function bindTabNavEvent() {
      var self = this;
      var elem = self.items;
      elem.forEach(function (tab) {
        tab.addEventListener('click', self.tabNavClick, {
          passive: true
        });
      });
    }
  }, {
    key: "bindTabPanelEvent",
    value: function bindTabPanelEvent() {
      var self = this;
      var panels = self.panels;
      if (self.mediaMatch) {
        panels.forEach(function (panel) {
          panel.addEventListener('mousedown', self.onSwipeStart);
          panel.addEventListener('touchstart', self.onSwipeStart);
          panel.addEventListener('mouseup', self.onSwipeEnd);
          panel.addEventListener('touchend', self.onSwipeEnd);
        });
      }
    }
  }, {
    key: "unbindTabPanelEvent",
    value: function unbindTabPanelEvent() {
      var self = this;
      var panels = self.panels;
      panels.forEach(function (panel) {
        panel.removeEventListener('mousedown', self.onSwipeStart);
        panel.removeEventListener('touchstart', self.onSwipeStart);
        panel.removeEventListener('mouseup', self.onSwipeEnd);
        panel.removeEventListener('touchend', self.onSwipeEnd);
      });
    }
  }, {
    key: "unbindTabNavEvent",
    value: function unbindTabNavEvent() {
      var self = this;
      var elem = self.items;
      var panels = self.panels;
      elem.forEach(function (tab) {
        tab.removeEventListener('click', self.tabNavClick);
      });
      panels.forEach(function (panel) {
        panel.removeEventListener('mousedown', self.onSwipeStart);
        panel.removeEventListener('touchstart', self.onSwipeStart);
        panel.removeEventListener('mouseup', self.onSwipeEnd);
        panel.removeEventListener('touchend', self.onSwipeEnd);
      });
      if (this.config.breakpoints !== 'all') {
        self.mql.removeEventListener('change', self.mediaMatches);
      }
    }
  }, {
    key: "tabNavClick",
    value: function tabNavClick(ev) {
      var self = this;
      var currentTab = ev.currentTarget;
      self.activeNav = ev.currentTarget;
      var currentSelector = currentTab.closest(self.config.wrapper);
      var elem = currentSelector.querySelectorAll(self.config.selectors.nav);
      var currentTabID = self.getNavTabID(currentTab);
      self.clearActiveClass(elem, 'nav');
      self.setActiveClass(currentTab, 'nav');
      self.tabPanelChange(currentTabID);
    }
  }, {
    key: "tabPanelChange",
    value: function tabPanelChange(index) {
      var self = this;
      if (typeof index === 'undefined') {
        return;
      }
      var currentPanelID = "".concat(self.config.data, "-").concat(index);
      var currentPanel = document.querySelector("#".concat(currentPanelID));
      self.activePanel = currentPanel;
      var currentPanelHolder = currentPanel.closest(self.config.wrapper);
      var elem = currentPanelHolder.querySelectorAll(self.config.selectors.panel);
      if (typeof currentPanel === 'undefined') {
        return;
      }
      self.clearActiveClass(elem, 'panel');
      self.setActiveClass(currentPanel, 'panel');
      self.currentIndex = index;
      self.emit('tabsChange');
    }
  }, {
    key: "getNavTabID",
    value: function getNavTabID(index) {
      var self = this;
      var dataID = index.getAttribute(self.config.data);
      return dataID;
    }
  }, {
    key: "clearActiveClass",
    value: function clearActiveClass(elem, section) {
      var self = this;
      elem.forEach(function (tab) {
        tab.classList.remove(self.config.classes.active);
        if (section === 'panel') {
          tab.setAttribute('aria-hidden', true);
        }
        if (section === 'nav') {
          tab.setAttribute('aria-selected', false);
        }
      });
    }
  }, {
    key: "setActiveClass",
    value: function setActiveClass(elem, section) {
      var self = this;
      elem.classList.add(self.config.classes.active);
      if (section === 'panel') {
        elem.setAttribute('aria-hidden', false);
      }
      if (section === 'nav') {
        elem.setAttribute('aria-selected', true);
      }
    }
  }, {
    key: "changeActiveTab",
    value: function changeActiveTab() {
      var i = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var self = this;
      var elems = self.items;
      var currentTab = elems[i];
      var currentSelector = currentTab.closest(self.config.wrapper);
      var elem = currentSelector.querySelectorAll(self.config.selectors.nav);
      var currentTabID = self.getNavTabID(currentTab);
      self.activeNav = currentTab;
      self.clearActiveClass(elem, 'nav');
      self.setActiveClass(currentTab, 'nav');
      self.tabPanelChange(currentTabID);
    }
  }, {
    key: "on",
    value: function on(events, callback) {
      var self = this;
      if (typeof callback !== 'function') return;
      events.split(' ').forEach(function (event, i) {
        if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
        self.eventsListeners[event].push(callback);
      });
    }
  }, {
    key: "off",
    value: function off(events, handler) {
      var self = this;
      if (!self.eventsListeners) return;
      events.split(' ').forEach(function (event) {
        if (typeof handler === 'undefined') {
          self.eventsListeners[event] = [];
        } else if (self.eventsListeners[event]) {
          self.eventsListeners[event].forEach(function (eventHandler, index) {
            if (eventHandler === handler) {
              self.eventsListeners[event].splice(index, 1);
            }
          });
        }
      });
    }
  }, {
    key: "emit",
    value: function emit() {
      var self = this;
      if (!self.eventsListeners) return self;
      var events;
      var data;
      var context;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      if (typeof args[0] === 'string' || Array.isArray(args[0])) {
        events = args[0];
        data = args.slice(1, args.length);
        context = self;
      } else {
        events = args[0].events;
        data = args[0].data;
        context = args[0].context || self;
      }

      // console.log(events, data, context);
      data.unshift(context);
      var eventsArray = Array.isArray(events) ? events : events.split(' ');
      eventsArray.forEach(function (event) {
        if (self.eventsListeners && self.eventsListeners[event]) {
          self.eventsListeners[event].forEach(function (eventHandler) {
            eventHandler.apply(context, data);
          });
        }
      });
    }
  }, {
    key: "onSwipeStart",
    value: function onSwipeStart(e) {
      var self = this;
      e.stopPropagation();
      self.swipeStart = e.pageX || e.targetTouches[0].pageX;
    }
  }, {
    key: "onSwipeEnd",
    value: function onSwipeEnd(e) {
      var self = this;
      e.stopPropagation();
      var pageX = e.pageX || e.changedTouches[0].pageX;
      var offset;
      if (self.swipeStart) {
        offset = self.swipeStart - pageX;
        if (Math.abs(offset) > 30) {
          if (offset > 30) {
            self.nextTab();
          }
          if (offset < -30) {
            self.prevTab();
          }
        }
        self.swipeStart = null;
      }
    }
  }, {
    key: "nextTab",
    value: function nextTab() {
      var self = this;
      var items = self.items;
      var currentItem = self.currentIndex;
      var numberOfElem = self.items.length;
      var foundIndex = 0;
      var nextElem;
      items.forEach(function (item, i) {
        var itemID = self.getNavTabID(item);
        if (itemID === currentItem) {
          foundIndex = i;
        }
      });
      if (foundIndex < numberOfElem - 1) {
        self.changeActiveTab(foundIndex + 1);
      }

      // foundIndex === numberOfElem - 1 ? nextElem = 0 : nextElem = foundIndex + 1;
      // self.changeActiveTab(nextElem);
    }
  }, {
    key: "prevTab",
    value: function prevTab() {
      var self = this;
      var items = self.items;
      var currentItem = self.currentIndex;
      var numberOfElem = self.items.length;
      var foundIndex = 0;
      var prevElem;
      items.forEach(function (item, i) {
        var itemID = self.getNavTabID(item);
        if (itemID === currentItem) {
          foundIndex = i;
        }
      });
      if (foundIndex > 0) {
        self.changeActiveTab(foundIndex - 1);
      }

      // foundIndex === 0 ? prevElem = numberOfElem - 1 : prevElem = foundIndex - 1;
      // self.changeActiveTab(prevElem);
    }
  }]);
  return DSMPTabsClass;
}();
/* harmony default export */ __webpack_exports__["default"] = (DSMPTabsClass);

/***/ }),

/***/ "./assets/_src/js/library/tabs-accordions/DSMPTabsToAccordionMobile.js":
/*!*****************************************************************************!*\
  !*** ./assets/_src/js/library/tabs-accordions/DSMPTabsToAccordionMobile.js ***!
  \*****************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DSMPAccordions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DSMPAccordions */ "./assets/_src/js/library/tabs-accordions/DSMPAccordions.js");
/* harmony import */ var _DSMPTabs_tab__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DSMPTabs-tab */ "./assets/_src/js/library/tabs-accordions/DSMPTabs-tab.js");
/* harmony import */ var _utils_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/utils */ "./assets/_src/js/utils/utils.js");
/* harmony import */ var _utils_u_types__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/u_types */ "./assets/_src/js/utils/u_types.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }




var DSMPTabToAccordionMobile = /*#__PURE__*/function () {
  function DSMPTabToAccordionMobile(selector) {
    _classCallCheck(this, DSMPTabToAccordionMobile);
    this.tabaccID = '#js-tab-acc';
    this.tabaccSelector = '.js-tabs-to-acc-wrapper';
    this.tabaccItems = document.querySelectorAll(this.tabaccSelector);
    this.tabOptions = {
      wrapper: '.js-tabs-wrapper',
      selectors: {
        nav: '.js-tabs-nav-item',
        panel: '.js-tabs-panel'
      }
    };
    this.accordionOptions = {
      selectors: {
        item: '.js-tabs-panel',
        trigger: '.js-tabs-label',
        content: '.js-ta-content'
      },
      opt: {
        close: true,
        expand: false,
        scrollToView: false
      },
      classes: {
        display: 'flex'
      },
      animation: {
        content: true
      }
    };
    this.isMobile = false;
    this.isDesktop = false;
    this.accordionInstance = null;
    this.tabInstance = null;
    if (typeof selector !== 'undefined') {
      this.tabaccID = selector;
    }
    this.init();
  }
  _createClass(DSMPTabToAccordionMobile, [{
    key: "init",
    value: function init() {
      var self = this;
      var currentWidth = window.innerWidth;
      var breakpoint = 768;
      currentWidth < breakpoint ? this.isMobile = true : this.isDesktop = true;
      if (self.isMobile) self.buildAccordion();
      if (self.isDesktop) self.buildTab();
      window.addEventListener('resize', function () {
        self.throttleScroll();
      });
      this.throttleScroll = (0,_utils_utils__WEBPACK_IMPORTED_MODULE_2__.u_throttled)(function () {
        self.buildTabAccordion();
      }, 150);
      self.buildTabAccordion();
    }
  }, {
    key: "buildTabAccordion",
    value: function buildTabAccordion() {
      var self = this;
      var newWidth = window.innerWidth;
      var breakpoint = 768;
      if (newWidth < breakpoint) {
        if (!self.isMobile) {
          if (typeof self.tabInstance !== 'undefined') {
            self.tabInstance.unbindTabNavEvent();
            self.tabInstance.unbindTabPanelEvent();
            self.tabInstance = undefined;
          }
          self.buildAccordion();
          self.isDesktop = false;
          self.isMobile = true;
        }
      } else {
        if (!self.isDesktop) {
          if (typeof self.accordionInstance !== 'undefined') {
            self.accordionInstance.accordionUnbindEvents();
            self.accordionInstance = undefined;
          }
          self.buildTab();
          self.isMobile = false;
          self.isDesktop = true;
        }
      }
    }
  }, {
    key: "buildAccordion",
    value: function buildAccordion() {
      this.parseOptions(this.tabaccID);
      this.accordionInstance = new _DSMPAccordions__WEBPACK_IMPORTED_MODULE_0__["default"](this.tabaccID, this.accordionOptions);
    }
  }, {
    key: "buildTab",
    value: function buildTab() {
      this.tabOptions.wrapper = this.tabaccID;
      this.tabInstance = new _DSMPTabs_tab__WEBPACK_IMPORTED_MODULE_1__["default"](this.tabOptions);
      this.tabInstance.changeActiveTab();
    }
  }, {
    key: "parseOptions",
    value: function parseOptions(selector) {
      var self = this;
      var wrapper = document.querySelector(selector);
      self.accordionOptions.opt.scrollToView = (0,_utils_u_types__WEBPACK_IMPORTED_MODULE_3__.u_parseBool)(wrapper.getAttribute('data-scroll-to-view')) || self.accordionOptions.opt.scrollToView;
      self.accordionOptions.classes.display = wrapper.getAttribute('data-acc-display') || self.accordionOptions.classes.display;
    }
  }]);
  return DSMPTabToAccordionMobile;
}();
/* harmony default export */ __webpack_exports__["default"] = (DSMPTabToAccordionMobile);

/***/ }),

/***/ "./assets/_src/js/library/tabs-accordions/DSMPVerticalTabsCPT.js":
/*!***********************************************************************!*\
  !*** ./assets/_src/js/library/tabs-accordions/DSMPVerticalTabsCPT.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "verticalTabsCPT": function() { return /* binding */ verticalTabsCPT; }
/* harmony export */ });
/* harmony import */ var _DSMPTabs_tab__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DSMPTabs-tab */ "./assets/_src/js/library/tabs-accordions/DSMPTabs-tab.js");
/* harmony import */ var _function_calls_tabs_to_accordion_mobile__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../function-calls/tabs-to-accordion-mobile */ "./assets/_src/js/function-calls/tabs-to-accordion-mobile.js");
/* provided dependency */ var $ = __webpack_require__(/*! jquery */ "jquery");
/* provided dependency */ var jQuery = __webpack_require__(/*! jquery */ "jquery");


function selectContinent() {
  $('.js-continent').each(function () {
    var _this = this;
    $(this).on('click', function (e) {
      var element = $(_this).closest('.m-tabs').find('.js-tabs-to-acc-wrapper');
      var loader = $(_this).parent().find('.js-loader');
      $(_this).parent().find('.js-continent').removeClass('is-active');
      $(_this).addClass('is-active');
      var continentID = e.target.dataset.continentId;
      var blockID = e.target.dataset.block_id;
      var navLayout = e.target.dataset.nav_layout;
      var navLayoutClassName = e.target.dataset.navLayoutClassName;
      var showNumbers = e.target.dataset.show_numbers;
      var transformMobile = e.target.dataset.transformmob;
      var leftBottomImage = '';
      if (e.target.dataset.leftbottomimage) {
        leftBottomImage = jQuery.parseJSON(e.target.dataset.leftbottomimage);
      }
      var layout = e.target.dataset.layout;
      var tabsPanelClassName = e.target.dataset.tabspanelclassname;
      var columnsOrder = e.target.dataset.columnsorder;
      var rightTopImage = '';
      if (e.target.dataset.righttopimage) {
        rightTopImage = jQuery.parseJSON(e.target.dataset.righttopimage);
      }
      var postIn = JSON.parse(e.target.dataset.postIn || '{}');

      // eslint-disable-next-line max-len
      continentNewContent({
        element: element,
        loader: loader,
        continentID: continentID,
        blockID: blockID,
        navLayout: navLayout,
        navLayoutClassName: navLayoutClassName,
        showNumbers: showNumbers,
        transformMobile: transformMobile,
        leftBottomImage: leftBottomImage,
        layout: layout,
        tabsPanelClassName: tabsPanelClassName,
        columnsOrder: columnsOrder,
        rightTopImage: rightTopImage,
        postIn: postIn
      });
    });
  });
}
function continentNewContent(_ref) {
  var element = _ref.element,
    loader = _ref.loader,
    continentID = _ref.continentID,
    blockID = _ref.blockID,
    navLayout = _ref.navLayout,
    navLayoutClassName = _ref.navLayoutClassName,
    showNumbers = _ref.showNumbers,
    transformMobile = _ref.transformMobile,
    leftBottomImage = _ref.leftBottomImage,
    layout = _ref.layout,
    tabsPanelClassName = _ref.tabsPanelClassName,
    columnsOrder = _ref.columnsOrder,
    rightTopImage = _ref.rightTopImage,
    postIn = _ref.postIn;
  loader.addClass('-visible');
  var ajaxData = {
    action: 'get_new_countries',
    continentID: continentID,
    blockID: blockID,
    navLayout: navLayout,
    navLayoutClassName: navLayoutClassName,
    showNumbers: showNumbers,
    transformMobile: transformMobile,
    leftBottomImage: leftBottomImage,
    layout: layout,
    tabsPanelClassName: tabsPanelClassName,
    columnsOrder: columnsOrder,
    rightTopImage: rightTopImage,
    postIn: postIn
  };
  jQuery.ajax({
    type: 'post',
    dataType: 'json',
    url: ds.ajax_url,
    data: ajaxData,
    success: function success(response) {
      loader.removeClass('-visible');
      if (response.success) {
        // console.log('response', response);
        $(element).html(response.data.html);
        var dropdown = new _DSMPTabs_tab__WEBPACK_IMPORTED_MODULE_0__["default"]({
          wrapper: "#".concat(element[0].getAttribute('id')),
          selectors: {
            nav: '.js-tabs-nav-item',
            panel: '.js-tabs-panel'
          }
        });
        dropdown.init();
        (0,_function_calls_tabs_to_accordion_mobile__WEBPACK_IMPORTED_MODULE_1__.callTabAccordionsMobile)();
      }
    }
  });
}
function verticalTabsCPT() {
  selectContinent();
}

/***/ }),

/***/ "./assets/_src/js/utils/u_fade-in-out.js":
/*!***********************************************!*\
  !*** ./assets/_src/js/utils/u_fade-in-out.js ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "u_fadeIn": function() { return /* binding */ u_fadeIn; },
/* harmony export */   "u_fadeOut": function() { return /* binding */ u_fadeOut; }
/* harmony export */ });
/**
 * https://www.ilearnjavascript.com/plainjs-fadein-fadeout/
 *
 * TODO: there are better fadeIn fadeOut scripts with animation easings
 */

// export const fadeIn = (el, displayStyle = 'block', smooth = true) => {
//     el.style.opacity = 0;
//     el.style.display = displayStyle;
//     if (smooth) {
//         let opacity = 0;
//         let request;
//
//         const animation = () => {
//             el.style.opacity = opacity += 0.04;
//             if (opacity >= 1) {
//                 opacity = 1;
//                 cancelAnimationFrame(request);
//             }
//         };
//
//         const rAf = () => {
//             request = requestAnimationFrame(rAf);
//             animation();
//         };
//         rAf();
//
//     } else {
//         el.style.opacity = 1;
//     }
// };
//
// export const fadeOut = (el, displayStyle = 'none', smooth = true ) => {
//     if (smooth) {
//         let opacity = el.style.opacity;
//         let request;
//
//         const animation = () => {
//             el.style.opacity = opacity -= 0.04;
//             if (opacity <= 0) {
//                 opacity = 0;
//                 el.style.display = displayStyle;
//                 cancelAnimationFrame(request);
//             }
//         };
//
//         const rAf = () => {
//             request = requestAnimationFrame(rAf);
//             animation();
//         };
//         rAf();
//
//     } else {
//         el.style.opacity = 0;
//     }
// };
var defaults = {
  duration: 100,
  complete: function complete() {}
};
var animateFade = function animateFade(options) {
  var start = new Date();
  var id = setInterval(function () {
    var timePassed = new Date() - start;
    var progress = timePassed / options.duration;
    if (progress > 1) {
      progress = 1;
    }
    options.progress = progress;
    var delta = options.delta(progress);
    options.step(delta);
    if (progress == 1) {
      clearInterval(id);
      if (typeof options.complete === "function") {
        options.complete();
      }
    }
  }, options.delay || 10);
};
var u_fadeIn = function u_fadeIn(element) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (typeof options.duration === "undefined") {
    options.duration = defaults.duration;
  }
  var to = 0;
  animateFade({
    duration: options.duration,
    delta: function delta(progress) {
      progress = this.progress;
      return easings.swing(progress);
    },
    complete: options.complete,
    step: function step(delta) {
      element.style.opacity = to + delta;
    }
  });
};
var u_fadeOut = function u_fadeOut(element) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (typeof options.duration === "undefined") {
    options.duration = defaults.duration;
  }
  var to = 1;
  animateFade({
    duration: options.duration,
    delta: function delta(progress) {
      progress = this.progress;
      return easings.swing(progress);
    },
    complete: options.complete,
    step: function step(delta) {
      element.style.opacity = to - delta;
    }
  });
};
var easings = {
  linear: function linear(progress) {
    return progress;
  },
  quadratic: function quadratic(progress) {
    return Math.pow(progress, 2);
  },
  swing: function swing(progress) {
    return 0.5 - Math.cos(progress * Math.PI) / 2;
  },
  circ: function circ(progress) {
    return 1 - Math.sin(Math.acos(progress));
  },
  back: function back(progress, x) {
    return Math.pow(progress, 2) * ((x + 1) * progress - x);
  },
  bounce: function bounce(progress) {
    for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
      if (progress >= (7 - 4 * a) / 11) {
        return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
      }
    }
  },
  elastic: function elastic(progress, x) {
    return Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * Math.PI * x / 3 * progress);
  }
};

/***/ }),

/***/ "./assets/_src/js/utils/u_io-anim-observer.js":
/*!****************************************************!*\
  !*** ./assets/_src/js/utils/u_io-anim-observer.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
var addObserver = function addObserver(el, params) {
  if (!('IntersectionObserver' in window)) {
    el.classList.add(params.className);
    if (params.cb) {
      params.cb(el);
    }
    return;
  }
  var observer = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add(params.className);
        // console.log(`${ Math.round(entry.intersectionRatio * 100) }%`);
        if (params.cb) {
          params.cb(entry);
        }
        if (params.repeat !== 'true') {
          observer.unobserve(entry.target);
        }
      } else if (params.repeat === 'true') {
        entry.target.classList.remove(params.className);
      }
    });
  }, {
    root: null,
    rootMargin: params.margin,
    threshold: params.threshold
  });
  observer.observe(el);
};
/* harmony default export */ __webpack_exports__["default"] = (addObserver);

/***/ }),

/***/ "./assets/_src/js/utils/u_io-anim.js":
/*!*******************************************!*\
  !*** ./assets/_src/js/utils/u_io-anim.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./assets/_src/js/utils/utils.js");
/* harmony import */ var _u_io_anim_observer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./u_io-anim-observer */ "./assets/_src/js/utils/u_io-anim-observer.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * Enable by toggling option in module ADVANCED SETTINGS/EFFECT in wp-admin page.
 * Module has the following options:
 *
 * ENABLED (ON/OFF):
 * Triggers IntersectionObserver on module.
 * Link: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver
 *
 * REPEATABLE (ON/OFF):
 * Check if the animation is repeated each time modules enters viewport.
 *
 * EFFECT (SELECT OPTION):
 * Chooses from one of predefined animation effects.
 * You can also do a custom CSS animation by adding custom class and animation it in CSS.
 *
 * Basic CSS animations:
 * Location: wp-content/themes/digitalexpress/assets/_src/sass/visuals/animate/_a-viewport.scss
 *
 * Custom CSS animations:
 * Location: wp-content/themes/digitalexpress/assets/_src/sass/project-custom/_custom__animations.scss
 *
 * THRESHOLD (STEPS SLIDER):
 * Specifies 'threshold' of the element:
 * Link: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/thresholds
 *
 * MARGIN (INPUT FIELD):
 * Specifies 'rootMargin' of the element:
 * Link: https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/rootMargin
 *
 * Custom overrides can be added.
 * Callback function can be triggered when elements enters viewport.
 *
 * Example usage on a custom element:
 * new DSMPViewAnim({
 *         selector: '.custom-selector',
 *         class: '.custom-animation-class',
 *         repeat: 'true',
 *         threshold: '0',
 *         margin: '0px 0px -10% 0px',
 *         // Callback function when element is intersecting
 *         callback: () => {
 *             console.log('callback function');
 *       },
 *  });
 */



var DSMPViewAnim = /*#__PURE__*/function () {
  function DSMPViewAnim(options) {
    _classCallCheck(this, DSMPViewAnim);
    this.config = {
      selector: '[data-viewport="true"]',
      repeat: 'false',
      class: 'in-view',
      threshold: 0,
      margin: '0px 0px 0px 0px',
      callback: function callback() {}
    };
    this.configOptions = _objectSpread(_objectSpread({}, this.config), options || {});
    this.triggers = document.querySelectorAll(this.configOptions.selector);
    this.inViewport();
    this.ioBindEvents();
  }
  _createClass(DSMPViewAnim, [{
    key: "inViewport",
    value: function inViewport() {
      var _this = this;
      this.triggers.forEach(function (trigger) {
        var attr = {
          repeat: trigger.dataset.viewportRepeat,
          threshold: trigger.dataset.viewportThreshold,
          margin: trigger.dataset.viewportMargin
        };
        var _this$configOptions = _this.configOptions,
          className = _this$configOptions.class,
          repeat = _this$configOptions.repeat,
          threshold = _this$configOptions.threshold,
          margin = _this$configOptions.margin,
          callback = _this$configOptions.callback;
        var attrRepeat = attr.repeat,
          attrThreshold = attr.threshold,
          attrMargin = attr.margin;
        (0,_u_io_anim_observer__WEBPACK_IMPORTED_MODULE_1__["default"])(trigger, {
          className: className,
          repeat: attrRepeat || repeat,
          threshold: attrThreshold || threshold,
          margin: attrMargin || margin,
          cb: callback
        });
      });
    }
  }, {
    key: "ioBindEvents",
    value: function ioBindEvents() {
      var _this2 = this;
      var throttleInView = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.u_throttled)(function () {
        _this2.inViewport();
      }, 30);

      // document.addEventListener('scroll', throttleInView, { passive: true });
      document.addEventListener('resize', throttleInView, {
        passive: true
      });
      document.addEventListener('orientationchange', throttleInView, {
        passive: true
      });
    }
  }]);
  return DSMPViewAnim;
}();
/* harmony default export */ __webpack_exports__["default"] = (DSMPViewAnim);

/***/ }),

/***/ "./assets/_src/js/utils/u_is-touch-device.js":
/*!***************************************************!*\
  !*** ./assets/_src/js/utils/u_is-touch-device.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "u_addTouchToHtml": function() { return /* binding */ u_addTouchToHtml; },
/* harmony export */   "u_isTouchDevice": function() { return /* binding */ u_isTouchDevice; }
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./assets/_src/js/utils/utils.js");


/**
 * standalone function that checks whether device is touch or not
 * call it within anything,
 * @returns {boolean}
 */
var u_isTouchDevice = function u_isTouchDevice() {
  return !!(typeof window !== 'undefined' && ('ontouchstart' in window || window.DocumentTouch && typeof document !== 'undefined' && document instanceof window.DocumentTouch)) || !!(typeof navigator !== 'undefined' && (navigator.maxTouchPoints || navigator.msMaxTouchPoints));
};

/**
 * function that calls isTouchDevice function,
 */
var isTouchHtmlUtil = function isTouchHtmlUtil() {
  var touch = u_isTouchDevice();
  var html = document.getElementsByTagName('html')[0];

  // if true, add touch-device to html, otherwise no-touch-device
  if (touch) {
    html.classList.remove('no-touch-device');
    html.classList.add('touch-device');
  } else {
    html.classList.remove('touch-device');
    html.classList.add('no-touch-device');
  }
};

/**
 * exported function addTouchToHtmlUtil
 * imported into index.js and called when DOMReady,
 * contains 'resize' event listener to check for
 * device orientation, or changes
 * is throttled, to prevent continuously triggering
 * (min 300ms so chrome dev tool can catch it)
 */
var u_addTouchToHtml = function u_addTouchToHtml() {
  isTouchHtmlUtil();

  // throttle the function
  var throttleIsTouch = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.u_throttled)(function () {
    isTouchHtmlUtil();
  }, 300);

  // bind resize event
  window.addEventListener('resize', function () {
    throttleIsTouch();
  });
};


/***/ }),

/***/ "./assets/_src/js/utils/u_object_extend.js":
/*!*************************************************!*\
  !*** ./assets/_src/js/utils/u_object_extend.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "u_extend": function() { return /* binding */ u_extend; },
/* harmony export */   "u_extendObject": function() { return /* binding */ u_extendObject; },
/* harmony export */   "u_mergeDeep": function() { return /* binding */ u_mergeDeep; }
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var u_extendObject = function u_extendObject(destination, source) {
  for (var property in source) {
    if (source[property] && source[property].constructor && source[property].constructor === Object) {
      destination[property] = destination[property] || {};
      u_extendObject(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }
  return destination;
};
var u_extend = function u_extend(defaults, options) {
  var extendedOptions = {};
  for (var key in defaults) {
    extendedOptions[key] = options[key] || defaults[key];
  }
  return extendedOptions;
};
var u_mergeDeep = function u_mergeDeep(target, source) {
  var isObject = function isObject(obj) {
    return obj && _typeof(obj) === 'object';
  };
  if (!isObject(target) || !isObject(source)) {
    return source;
  }
  Object.keys(source).forEach(function (key) {
    var targetValue = target[key];
    var sourceValue = source[key];
    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = u_mergeDeep(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
  });
  return target;
};


/***/ }),

/***/ "./assets/_src/js/utils/u_show-hide-display.js":
/*!*****************************************************!*\
  !*** ./assets/_src/js/utils/u_show-hide-display.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "u_hideDisplay": function() { return /* binding */ u_hideDisplay; },
/* harmony export */   "u_hideElem": function() { return /* binding */ u_hideElem; },
/* harmony export */   "u_showDisplay": function() { return /* binding */ u_showDisplay; },
/* harmony export */   "u_showElem": function() { return /* binding */ u_showElem; },
/* harmony export */   "u_toggleElem": function() { return /* binding */ u_toggleElem; }
/* harmony export */ });
/**
 * Visibility functions
 */

var u_showDisplay = function u_showDisplay(elem) {
  elem.style.display = "block";
};
var u_hideDisplay = function u_hideDisplay(elem) {
  elem.style.display = "none";
};
var u_showElem = function u_showElem(elem) {
  var hidden = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'is-hidden';
  var visible = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'is-shown';
  elem.classList.remove(hidden);
  elem.classList.add(visible);
};
var u_hideElem = function u_hideElem(elem) {
  var hidden = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'is-hidden';
  var visible = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'is-shown';
  elem.classList.add(hidden);
  elem.classList.remove(visible);
};
var u_toggleElem = function u_toggleElem(elem) {
  var hidden = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'is-hidden';
  elem.classList.toggle(hidden);
};


/***/ }),

/***/ "./assets/_src/js/utils/u_slide-up-down.js":
/*!*************************************************!*\
  !*** ./assets/_src/js/utils/u_slide-up-down.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "u_slideDown": function() { return /* binding */ u_slideDown; },
/* harmony export */   "u_slideToggle": function() { return /* binding */ u_slideToggle; },
/* harmony export */   "u_slideUp": function() { return /* binding */ u_slideUp; }
/* harmony export */ });
/* harmony import */ var _u_object_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./u_object_extend */ "./assets/_src/js/utils/u_object_extend.js");
/* harmony import */ var _u_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./u_types */ "./assets/_src/js/utils/u_types.js");
/**
 * https://github.com/janrembold/es6-slide-up-down
 *
 * usage with easings
 *
 */



var defaults = {
  duration: 250,
  easing: function easing(currentTime, startValue, diffValue, dureation) {
    return -diffValue * (currentTime /= dureation) * (currentTime - 2) + startValue;
  },
  display: 'block'
};
var directions = {
  OPEN: 1,
  CLOSE: 2
};
var u_slideUp = function u_slideUp(element) {
  var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if ((0,_u_types__WEBPACK_IMPORTED_MODULE_1__.u_isInteger)(args)) {
    args = {
      duration: args
    };
  }
  var options = (0,_u_object_extend__WEBPACK_IMPORTED_MODULE_0__.u_extend)(defaults, args);
  var displayType = options.display;
  options.direction = directions.CLOSE;
  options.to = 0;
  options.startingHeight = element.scrollHeight;
  options.distanceHeight = -options.startingHeight;
  setElementAnimationStyles(element, displayType);
  window.requestAnimationFrame(function (timestamp) {
    return animate(element, options, timestamp);
  });
};
var u_slideDown = function u_slideDown(element) {
  var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if ((0,_u_types__WEBPACK_IMPORTED_MODULE_1__.u_isInteger)(args)) {
    args = {
      duration: args
    };
  }
  element.style.height = '0px';
  var options = (0,_u_object_extend__WEBPACK_IMPORTED_MODULE_0__.u_extend)(defaults, args);
  var displayType = options.display;
  setElementAnimationStyles(element, displayType);
  options.direction = directions.OPEN;
  options.to = element.scrollHeight;
  options.startingHeight = 0;
  options.distanceHeight = options.to;
  window.requestAnimationFrame(function (timestamp) {
    return animate(element, options, timestamp);
  });
};
var animate = function animate(element, options, now) {
  if (!options.startTime) {
    options.startTime = now;
  }
  var currentTime = now - options.startTime;
  var animationContinue = currentTime < options.duration;
  var newHeight = options.easing(currentTime, options.startingHeight, options.distanceHeight, options.duration);
  if (animationContinue) {
    element.style.height = "".concat(newHeight.toFixed(2), "px");
    window.requestAnimationFrame(function (timestamp) {
      return animate(element, options, timestamp);
    });
  } else {
    if (options.direction === directions.CLOSE) {
      element.style.display = 'none';
    }
    if (options.direction === directions.OPEN) {
      element.style.display = options.display === 'flex' ? 'flex' : 'block';
    }
    removeElementAnimationStyles(element);
  }
};
var setElementAnimationStyles = function setElementAnimationStyles(element) {
  var displayType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'block';
  element.style.display = displayType === 'flex' ? 'flex' : 'block';
  element.style.overflow = 'hidden';
  element.style.marginTop = '0';
  element.style.marginBottom = '0';
  element.style.paddingTop = '0';
  element.style.paddingBottom = '0';
};
var removeElementAnimationStyles = function removeElementAnimationStyles(element) {
  element.style.height = null;
  element.style.overflow = null;
  element.style.marginTop = null;
  element.style.marginBottom = null;
  element.style.paddingTop = null;
  element.style.paddingBottom = null;
};
var u_slideToggle = function u_slideToggle(element) {
  var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (window.getComputedStyle(element).display === 'none') {
    return u_slideDown(element, args);
  } else {
    return u_slideUp(element, args);
  }
};

/***/ }),

/***/ "./assets/_src/js/utils/u_types.js":
/*!*****************************************!*\
  !*** ./assets/_src/js/utils/u_types.js ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "u_isInteger": function() { return /* binding */ u_isInteger; },
/* harmony export */   "u_isObject": function() { return /* binding */ u_isObject; },
/* harmony export */   "u_parseBool": function() { return /* binding */ u_parseBool; }
/* harmony export */ });
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var u_isInteger = function u_isInteger(value) {
  if (Number.isInteger) {
    return Number.isInteger(value);
  } else {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  }
};
var u_isObject = function u_isObject(o) {
  return _typeof(o) === 'object' && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === 'Object';
};
var u_parseBool = function u_parseBool(str) {
  // console.log(typeof str);
  // strict: JSON.parse(str)

  if (str == null) return false;
  if (typeof str === 'boolean') {
    return str === true;
  }
  if (typeof str === 'string') {
    if (str == "") return false;
    str = str.replace(/^\s+|\s+$/g, '');
    if (str.toLowerCase() == 'true' || str.toLowerCase() == 'yes') return true;
    str = str.replace(/,/g, '.');
    str = str.replace(/^\s*\-\s*/g, '-');
  }

  // var isNum = string.match(/^[0-9]+$/) != null;
  // var isNum = /^\d+$/.test(str);
  if (!isNaN(str)) return parseFloat(str) != 0;
  return false;
};


/***/ }),

/***/ "./assets/_src/js/utils/utils.js":
/*!***************************************!*\
  !*** ./assets/_src/js/utils/utils.js ***!
  \***************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "u_debounced": function() { return /* binding */ u_debounced; },
/* harmony export */   "u_throttled": function() { return /* binding */ u_throttled; }
/* harmony export */ });
var _this = undefined;
var u_debounced = function u_debounced(func, delay, immediate) {
  var timerId;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    var boundFunc = func.bind.apply(func, [_this].concat(args));
    clearTimeout(timerId);
    if (immediate && !timerId) {
      boundFunc();
    }
    var calleeFunc = immediate ? function () {
      timerId = null;
    } : boundFunc;
    timerId = setTimeout(calleeFunc, delay);
  };
};
var u_throttled = function u_throttled(func, delay, immediate) {
  var timerId;
  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    var boundFunc = func.bind.apply(func, [_this].concat(args));
    if (timerId) {
      return;
    }
    if (immediate && !timerId) {
      boundFunc();
    }
    timerId = setTimeout(function () {
      if (!immediate) {
        boundFunc();
      }
      timerId = null;
    }, delay);
  };
};


/***/ }),

/***/ "jquery":
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/***/ (function(module) {

module.exports = jQuery;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!*********************************!*\
  !*** ./assets/_src/js/v6WBmsMCA2to.js ***!
  \*********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_u_is_touch_device__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/u_is-touch-device */ "./assets/_src/js/utils/u_is-touch-device.js");
/* harmony import */ var _utils_u_io_anim__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/u_io-anim */ "./assets/_src/js/utils/u_io-anim.js");
/* harmony import */ var _header_ds_headerSticky__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./header/ds_headerSticky */ "./assets/_src/js/header/ds_headerSticky.js");
/* harmony import */ var _header_ds_headerSearch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./header/ds_headerSearch */ "./assets/_src/js/header/ds_headerSearch.js");
/* harmony import */ var _header_ds_headerMenuToggle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./header/ds_headerMenuToggle */ "./assets/_src/js/header/ds_headerMenuToggle.js");
/* harmony import */ var _header_ds_menuSubMenuToggle__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./header/ds_menuSubMenuToggle */ "./assets/_src/js/header/ds_menuSubMenuToggle.js");
/* harmony import */ var _header_ds_headerMobileSwipeUp__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./header/ds_headerMobileSwipeUp */ "./assets/_src/js/header/ds_headerMobileSwipeUp.js");
/* harmony import */ var _header_ds_puma_global__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./header/ds_puma_global */ "./assets/_src/js/header/ds_puma_global.js");
/* harmony import */ var _function_calls_sliders__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./function-calls/sliders */ "./assets/_src/js/function-calls/sliders.js");
/* harmony import */ var _function_calls_accordions__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./function-calls/accordions */ "./assets/_src/js/function-calls/accordions.js");
/* harmony import */ var _function_calls_tabs_to_accordion_mobile__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./function-calls/tabs-to-accordion-mobile */ "./assets/_src/js/function-calls/tabs-to-accordion-mobile.js");
/* harmony import */ var _function_calls_3d_media_image_spinner__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./function-calls/3d-media/image-spinner */ "./assets/_src/js/function-calls/3d-media/image-spinner.js");
/* harmony import */ var _library_collapsers_ds_collapse__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./library/collapsers/ds_collapse */ "./assets/_src/js/library/collapsers/ds_collapse.js");
/* harmony import */ var _library_collapsers_ds_toggleElement__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./library/collapsers/ds_toggleElement */ "./assets/_src/js/library/collapsers/ds_toggleElement.js");
/* harmony import */ var _function_calls_tinymce_read_more_ds_readMore__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./function-calls/tinymce-read-more/ds_readMore */ "./assets/_src/js/function-calls/tinymce-read-more/ds_readMore.js");
/* harmony import */ var _library_collapsers_ds_gridderInit__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./library/collapsers/ds_gridderInit */ "./assets/_src/js/library/collapsers/ds_gridderInit.js");
/* harmony import */ var _blog_ds_blog_filter__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./blog/ds_blog-filter */ "./assets/_src/js/blog/ds_blog-filter.js");
/* harmony import */ var _library_media_controls_media_control__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./library/media-controls/media-control */ "./assets/_src/js/library/media-controls/media-control.js");
/* harmony import */ var _library_tabs_accordions_DSMPTabs_tab__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./library/tabs-accordions/DSMPTabs-tab */ "./assets/_src/js/library/tabs-accordions/DSMPTabs-tab.js");
/* harmony import */ var _library_tabs_accordions_DSMPTabs_dropdown__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./library/tabs-accordions/DSMPTabs-dropdown */ "./assets/_src/js/library/tabs-accordions/DSMPTabs-dropdown.js");
/* harmony import */ var _library_tabs_accordions_DSMPTabs_tabdropdown__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./library/tabs-accordions/DSMPTabs-tabdropdown */ "./assets/_src/js/library/tabs-accordions/DSMPTabs-tabdropdown.js");
/* harmony import */ var _library_tabs_accordions_DSMPVerticalTabsCPT__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./library/tabs-accordions/DSMPVerticalTabsCPT */ "./assets/_src/js/library/tabs-accordions/DSMPVerticalTabsCPT.js");
/* harmony import */ var _library_tabs_accordions_DSMPRetail_lubricants__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./library/tabs-accordions/DSMPRetail-lubricants */ "./assets/_src/js/library/tabs-accordions/DSMPRetail-lubricants.js");
/* harmony import */ var _library_lubricants_ds_filter_lubricants__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./library/lubricants/ds_filter_lubricants */ "./assets/_src/js/library/lubricants/ds_filter_lubricants.js");
/* harmony import */ var _library_openings_ds_filter_openings__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./library/openings/ds_filter_openings */ "./assets/_src/js/library/openings/ds_filter_openings.js");
/* harmony import */ var _library_resources_ds_resources__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./library/resources/ds_resources */ "./assets/_src/js/library/resources/ds_resources.js");
/* harmony import */ var _library_counters_purecounter__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./library/counters/purecounter */ "./assets/_src/js/library/counters/purecounter.js");
/* harmony import */ var _library_counters_progress_counter__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./library/counters/progress-counter */ "./assets/_src/js/library/counters/progress-counter.js");
/* harmony import */ var _components_correctClipPath__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./components/correctClipPath */ "./assets/_src/js/components/correctClipPath.js");
/*
 * @title Main App
 * @description Application entry point
 */

// Utils

// import { u_scrollEffect } from './utils/u_scroll-effect';


// Header







// import { ds_headerHeight } from "./header/ds_headerHeight";

// Function Calls










// Libraries










// Components



document.addEventListener('DOMContentLoaded', function () {
  // Check whether it is touch device or not
  (0,_utils_u_is_touch_device__WEBPACK_IMPORTED_MODULE_0__.u_addTouchToHtml)();
  // u_scrollEffect()

  /**
   * Header
   */
  // Sticky header
  (0,_header_ds_headerSticky__WEBPACK_IMPORTED_MODULE_2__.ds_headerSticky)('.site-header', 'is-sticky');
  // ds_headerHeight();

  /**
   * Ringardasbal Module
   */
  (0,_header_ds_puma_global__WEBPACK_IMPORTED_MODULE_7__.ds_pumaGlobal)();
  /**
   * Mobile menu navigation
   */
  // Mobile menu toggle
  (0,_header_ds_headerMenuToggle__WEBPACK_IMPORTED_MODULE_4__.ds_headerMenuToggle)('.js-m-burger-toggle');
  // Mobile menu submenu toggle
  (0,_header_ds_menuSubMenuToggle__WEBPACK_IMPORTED_MODULE_5__.ds_headerMenuSubMenuToggle)('.js-m-burger-wrap', '.js-m-burger-toggle');
  // Mobile menu swipe up close
  (0,_header_ds_headerMobileSwipeUp__WEBPACK_IMPORTED_MODULE_6__.ds_headerMobileSwipeUp)('.js-m-burger-toggle');

  /**
   * Desktop menu navigation
   */
  // Desktop burger menu toggle
  (0,_header_ds_headerMenuToggle__WEBPACK_IMPORTED_MODULE_4__.ds_headerMenuToggle)('.js-d-burger-toggle');
  // Desktop burger menu submenu toggle
  (0,_header_ds_menuSubMenuToggle__WEBPACK_IMPORTED_MODULE_5__.ds_headerMenuSubMenuToggle)('.js-d-burger-wrap', '.js-d-burger-toggle');
  (0,_header_ds_headerSearch__WEBPACK_IMPORTED_MODULE_3__.ds_headerSearch)();

  /**
   * Utils
   */
  (0,_library_collapsers_ds_collapse__WEBPACK_IMPORTED_MODULE_12__.ds_collapse)();
  (0,_function_calls_tinymce_read_more_ds_readMore__WEBPACK_IMPORTED_MODULE_14__.ds_readMore)();
  (0,_library_collapsers_ds_toggleElement__WEBPACK_IMPORTED_MODULE_13__.ds_toggleElement)();
  // Enable if using Gridder
  (0,_library_collapsers_ds_gridderInit__WEBPACK_IMPORTED_MODULE_15__.ds_gridderInit)();

  // Move to js-blog.js if not using Content block with load more
  if (document.querySelector('.js-ajax-block')) {
    (0,_blog_ds_blog_filter__WEBPACK_IMPORTED_MODULE_16__.ds_loadMoreBlog)();
  }

  /**
   * Libraries
   */
  new _library_media_controls_media_control__WEBPACK_IMPORTED_MODULE_17__["default"]();
  new _library_tabs_accordions_DSMPTabs_tab__WEBPACK_IMPORTED_MODULE_18__["default"]();
  new _library_tabs_accordions_DSMPTabs_dropdown__WEBPACK_IMPORTED_MODULE_19__["default"]();
  new _library_tabs_accordions_DSMPTabs_tabdropdown__WEBPACK_IMPORTED_MODULE_20__["default"]();
  (0,_library_tabs_accordions_DSMPVerticalTabsCPT__WEBPACK_IMPORTED_MODULE_21__.verticalTabsCPT)();
  (0,_library_tabs_accordions_DSMPRetail_lubricants__WEBPACK_IMPORTED_MODULE_22__.ds_retailLubricantsFilters)();
  (0,_library_lubricants_ds_filter_lubricants__WEBPACK_IMPORTED_MODULE_23__.ds_lubricants_filters)();
  (0,_library_resources_ds_resources__WEBPACK_IMPORTED_MODULE_25__.ds_resources_data)();
  (0,_library_openings_ds_filter_openings__WEBPACK_IMPORTED_MODULE_24__.ds_openings_filters)();
  (0,_function_calls_sliders__WEBPACK_IMPORTED_MODULE_8__.callSliders)();
  (0,_function_calls_accordions__WEBPACK_IMPORTED_MODULE_9__.callAccordions)();
  (0,_function_calls_tabs_to_accordion_mobile__WEBPACK_IMPORTED_MODULE_10__.callTabAccordionsMobile)();
  // 3D Image Spinner
  (0,_function_calls_3d_media_image_spinner__WEBPACK_IMPORTED_MODULE_11__.callImageSpinners)();

  /**
   * Components
   */
  new _library_counters_purecounter__WEBPACK_IMPORTED_MODULE_26__["default"]({
    selector: '.c-counter__number'
  });
  new _library_counters_progress_counter__WEBPACK_IMPORTED_MODULE_27__["default"]({
    percentage: 80
  });
  new _utils_u_io_anim__WEBPACK_IMPORTED_MODULE_1__["default"]({});
  (0,_components_correctClipPath__WEBPACK_IMPORTED_MODULE_28__.correctClipPath)();
});
window.addEventListener('load', function () {
  // Enable if using lazy load on Video (set data-src instead of src)
  // let lazyLoadInstance = new LazyLoad();
});
}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFFO0VBRXJCcGtCLG9FQUFXLEVBQUU7RUFDYmQsMEVBQWMsRUFBRTtFQUNoQjBLLGtHQUF1QixFQUFFO0VBQ3pCO0VBQ0FyTiwwRkFBaUIsRUFBRTs7RUFFbkI7QUFDSjtBQUNBO0VBQ0ksSUFBSW1oQixzRUFBVyxDQUFDO0lBQ1puZixRQUFRLEVBQUU7RUFDZCxDQUFDLENBQUM7RUFFRixJQUFJZ2EsMkVBQXFCLENBQUM7SUFDdEJPLFVBQVUsRUFBRTtFQUNoQixDQUFDLENBQUM7RUFFRixJQUFJaWpCLHdEQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7RUFFcEIxaEMsNkVBQWUsRUFBRTtBQUNyQixDQUFDLENBQUM7QUFFRjVHLE1BQU0sQ0FBQzRGLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxZQUFNO0VBQ2xDO0VBQ0E7QUFBQSxDQUNILENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvYmxvZy9kc19ibG9nLWZpbHRlci5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2NvbXBvbmVudHMvY29ycmVjdENsaXBQYXRoLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvZnVuY3Rpb24tY2FsbHMvM2QtbWVkaWEvaW1hZ2Utc3Bpbm5lci5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2Z1bmN0aW9uLWNhbGxzL2FjY29yZGlvbnMuanMiLCJ3ZWJwYWNrOi8vZHMtZ3VscC13ZWJwYWNrLXN0YXJ0ZXIvLi9hc3NldHMvX3NyYy9qcy9mdW5jdGlvbi1jYWxscy9hY2NvcmRpb25zL2FjY29yZGlvbnMuanMiLCJ3ZWJwYWNrOi8vZHMtZ3VscC13ZWJwYWNrLXN0YXJ0ZXIvLi9hc3NldHMvX3NyYy9qcy9mdW5jdGlvbi1jYWxscy9zbGlkZXJzLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvZnVuY3Rpb24tY2FsbHMvc2xpZGVycy9zbGlkZXItYWR2YW5jZWQuanMiLCJ3ZWJwYWNrOi8vZHMtZ3VscC13ZWJwYWNrLXN0YXJ0ZXIvLi9hc3NldHMvX3NyYy9qcy9mdW5jdGlvbi1jYWxscy9zbGlkZXJzL3NsaWRlci1jaXJjdWxhci5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2Z1bmN0aW9uLWNhbGxzL3NsaWRlcnMvc2xpZGVyLWRzYmxzLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvZnVuY3Rpb24tY2FsbHMvc2xpZGVycy9zbGlkZXItZXh0ZW5kZWQuanMiLCJ3ZWJwYWNrOi8vZHMtZ3VscC13ZWJwYWNrLXN0YXJ0ZXIvLi9hc3NldHMvX3NyYy9qcy9mdW5jdGlvbi1jYWxscy9zbGlkZXJzL3NsaWRlci1zaW1wbGUuanMiLCJ3ZWJwYWNrOi8vZHMtZ3VscC13ZWJwYWNrLXN0YXJ0ZXIvLi9hc3NldHMvX3NyYy9qcy9mdW5jdGlvbi1jYWxscy90YWJzLXRvLWFjY29yZGlvbi1tb2JpbGUuanMiLCJ3ZWJwYWNrOi8vZHMtZ3VscC13ZWJwYWNrLXN0YXJ0ZXIvLi9hc3NldHMvX3NyYy9qcy9mdW5jdGlvbi1jYWxscy90aW55bWNlLXJlYWQtbW9yZS9kc19yZWFkTW9yZS5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2hlYWRlci9kc19oZWFkZXJNZW51VG9nZ2xlLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvaGVhZGVyL2RzX2hlYWRlck1vYmlsZVN3aXBlVXAuanMiLCJ3ZWJwYWNrOi8vZHMtZ3VscC13ZWJwYWNrLXN0YXJ0ZXIvLi9hc3NldHMvX3NyYy9qcy9oZWFkZXIvZHNfaGVhZGVyU2VhcmNoLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvaGVhZGVyL2RzX2hlYWRlclN0aWNreS5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2hlYWRlci9kc19tZW51U3ViTWVudVRvZ2dsZS5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2hlYWRlci9kc19wdW1hX2dsb2JhbC5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2hlYWRlci91dGlscy91LW1lbnUuanMiLCJ3ZWJwYWNrOi8vZHMtZ3VscC13ZWJwYWNrLXN0YXJ0ZXIvLi9hc3NldHMvX3NyYy9qcy9saWJyYXJ5LzNkLW1lZGlhL3NwaW5uZXItY29udHJvbHMvYXV0b2FuaW1hdGUuanMiLCJ3ZWJwYWNrOi8vZHMtZ3VscC13ZWJwYWNrLXN0YXJ0ZXIvLi9hc3NldHMvX3NyYy9qcy9saWJyYXJ5LzNkLW1lZGlhL3NwaW5uZXItY29udHJvbHMvZnJhbWVzLW5hdi5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2xpYnJhcnkvM2QtbWVkaWEvc3Bpbm5lci1jb250cm9scy9mdWxsc2NyZWVuLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvbGlicmFyeS8zZC1tZWRpYS9zcGlubmVyLWNvbnRyb2xzL2hvdHNwb3RzLW5hdi5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2xpYnJhcnkvM2QtbWVkaWEvc3Bpbm5lci1jb250cm9scy9wbGF5YmFjay5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2xpYnJhcnkvM2QtbWVkaWEvc3Bpbm5lci1jb250cm9scy9wcm9ncmVzcy1mcmFjdGlvbi5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2xpYnJhcnkvM2QtbWVkaWEvc3Bpbm5lci1jb250cm9scy96b29tLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvbGlicmFyeS8zZC1tZWRpYS9zcGlubmVyLXBsdWdpbnMvY3RybC1kcmFnLXBsdWdpbi5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2xpYnJhcnkvM2QtbWVkaWEvc3Bpbm5lci1wbHVnaW5zL2N0cmwtZnJhbWVzLW5hdi1wbHVnaW4uanMiLCJ3ZWJwYWNrOi8vZHMtZ3VscC13ZWJwYWNrLXN0YXJ0ZXIvLi9hc3NldHMvX3NyYy9qcy9saWJyYXJ5LzNkLW1lZGlhL3NwaW5uZXItcGx1Z2lucy9jdHJsLWZ1bGxzY3JlZW4tcGx1Z2luLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvbGlicmFyeS8zZC1tZWRpYS9zcGlubmVyLXBsdWdpbnMvY3RybC1wbGF5YmFjay1wbHVnaW4uanMiLCJ3ZWJwYWNrOi8vZHMtZ3VscC13ZWJwYWNrLXN0YXJ0ZXIvLi9hc3NldHMvX3NyYy9qcy9saWJyYXJ5LzNkLW1lZGlhL3NwaW5uZXItcGx1Z2lucy9jdHJsLXpvb20tcGx1Z2luLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvbGlicmFyeS8zZC1tZWRpYS9zcGlubmVyLXBsdWdpbnMvaG90c3BvdHMtcGx1Z2luLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvbGlicmFyeS8zZC1tZWRpYS9zcGlubmVyLXBsdWdpbnMvcHJvZ3Jlc3MtZnJhY3Rpb24tcGx1Z2luLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvbGlicmFyeS9hbmltYXRpb25zL2Vhc2luZ3MtZXM2LmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvbGlicmFyeS9hbmltYXRpb25zL3Njcm9sbC10by5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2xpYnJhcnkvY29sbGFwc2Vycy9kc19jb2xsYXBzZS5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2xpYnJhcnkvY29sbGFwc2Vycy9kc19ncmlkZGVySW5pdC5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2xpYnJhcnkvY29sbGFwc2Vycy9kc190b2dnbGVFbGVtZW50LmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvbGlicmFyeS9jb3VudGVycy9wcm9ncmVzcy1jb3VudGVyLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvbGlicmFyeS9jb3VudGVycy9wdXJlY291bnRlci5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2xpYnJhcnkvbHVicmljYW50cy9kc19maWx0ZXJfbHVicmljYW50cy5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2xpYnJhcnkvbWVkaWEtY29udHJvbHMvbWVkaWEtY29udHJvbC5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2xpYnJhcnkvb3BlbmluZ3MvZHNfZmlsdGVyX29wZW5pbmdzLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvbGlicmFyeS9yZXNvdXJjZXMvZHNfcmVzb3VyY2VzLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvbGlicmFyeS9zbGlkZXJzL3NsaWRlci1kc2Jscy5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2xpYnJhcnkvc2xpZGVycy9zbGlkZXItb3B0aW9ucy9hdXRvcGxheS5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2xpYnJhcnkvc2xpZGVycy9zbGlkZXItb3B0aW9ucy9hdXRvcGxheU9ic2VydmVyLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvbGlicmFyeS9zbGlkZXJzL3NsaWRlci1vcHRpb25zL2JyZWFrcG9pbnRzLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvbGlicmFyeS9zbGlkZXJzL3NsaWRlci1vcHRpb25zL2VmZmVjdHMuanMiLCJ3ZWJwYWNrOi8vZHMtZ3VscC13ZWJwYWNrLXN0YXJ0ZXIvLi9hc3NldHMvX3NyYy9qcy9saWJyYXJ5L3NsaWRlcnMvc2xpZGVyLW9wdGlvbnMvbGF6eS5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2xpYnJhcnkvc2xpZGVycy9zbGlkZXItb3B0aW9ucy9sb29wLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvbGlicmFyeS9zbGlkZXJzL3NsaWRlci1vcHRpb25zL25hdmlnYXRpb24uanMiLCJ3ZWJwYWNrOi8vZHMtZ3VscC13ZWJwYWNrLXN0YXJ0ZXIvLi9hc3NldHMvX3NyYy9qcy9saWJyYXJ5L3NsaWRlcnMvc2xpZGVyLW9wdGlvbnMvcGFnaW5hdGlvbi5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2xpYnJhcnkvc2xpZGVycy9zd2lwZXItd2l0aC1jaXJjdWxhci10YWJzLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvbGlicmFyeS9zbGlkZXJzL3N3aXBlci13aXRoLXRhYnMuanMiLCJ3ZWJwYWNrOi8vZHMtZ3VscC13ZWJwYWNrLXN0YXJ0ZXIvLi9hc3NldHMvX3NyYy9qcy9saWJyYXJ5L3RhYnMtYWNjb3JkaW9ucy9EU01QQWNjb3JkaW9ucy5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2xpYnJhcnkvdGFicy1hY2NvcmRpb25zL0RTTVBSZXRhaWwtbHVicmljYW50cy5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2xpYnJhcnkvdGFicy1hY2NvcmRpb25zL0RTTVBUYWJzLWRyb3Bkb3duLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvbGlicmFyeS90YWJzLWFjY29yZGlvbnMvRFNNUFRhYnMtdGFiLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvbGlicmFyeS90YWJzLWFjY29yZGlvbnMvRFNNUFRhYnMtdGFiZHJvcGRvd24uanMiLCJ3ZWJwYWNrOi8vZHMtZ3VscC13ZWJwYWNrLXN0YXJ0ZXIvLi9hc3NldHMvX3NyYy9qcy9saWJyYXJ5L3RhYnMtYWNjb3JkaW9ucy9EU01QVGFic0NsYXNzLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvbGlicmFyeS90YWJzLWFjY29yZGlvbnMvRFNNUFRhYnNUb0FjY29yZGlvbk1vYmlsZS5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL2xpYnJhcnkvdGFicy1hY2NvcmRpb25zL0RTTVBWZXJ0aWNhbFRhYnNDUFQuanMiLCJ3ZWJwYWNrOi8vZHMtZ3VscC13ZWJwYWNrLXN0YXJ0ZXIvLi9hc3NldHMvX3NyYy9qcy91dGlscy91X2ZhZGUtaW4tb3V0LmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvdXRpbHMvdV9pby1hbmltLW9ic2VydmVyLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvdXRpbHMvdV9pby1hbmltLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvdXRpbHMvdV9pcy10b3VjaC1kZXZpY2UuanMiLCJ3ZWJwYWNrOi8vZHMtZ3VscC13ZWJwYWNrLXN0YXJ0ZXIvLi9hc3NldHMvX3NyYy9qcy91dGlscy91X29iamVjdF9leHRlbmQuanMiLCJ3ZWJwYWNrOi8vZHMtZ3VscC13ZWJwYWNrLXN0YXJ0ZXIvLi9hc3NldHMvX3NyYy9qcy91dGlscy91X3Nob3ctaGlkZS1kaXNwbGF5LmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvdXRpbHMvdV9zbGlkZS11cC1kb3duLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyLy4vYXNzZXRzL19zcmMvanMvdXRpbHMvdV90eXBlcy5qcyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci8uL2Fzc2V0cy9fc3JjL2pzL3V0aWxzL3V0aWxzLmpzIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyL2V4dGVybmFsIHZhciBcImpRdWVyeVwiIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9kcy1ndWxwLXdlYnBhY2stc3RhcnRlci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2RzLWd1bHAtd2VicGFjay1zdGFydGVyL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vZHMtZ3VscC13ZWJwYWNrLXN0YXJ0ZXIvLi9hc3NldHMvX3NyYy9qcy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBkc19sb2FkTW9yZUJsb2cgPSAoKSA9PiB7XG4gICAgKGZ1bmN0aW9uICgkKSB7XG4gICAgICAgIC8vIGpRdWVyeShkb2N1bWVudCkub24oJ2luaXRfZmlsdGVyJywgKGUsIG1vZHVsZSkgPT4ge1xuICAgICAgICAvLyAgICAgRFNJbml0RmlsdGVyKG1vZHVsZSk7XG4gICAgICAgIC8vIH0pO1xuXG4gICAgICAgIGxldCBEU0luaXRGaWx0ZXIgPSBmdW5jdGlvbiAobW9kdWxlKSB7XG4gICAgICAgICAgICBjb25zdCBmaWx0ZXIgPSB7XG4gICAgICAgICAgICAgICAgbW9kdWxlOiBudWxsLFxuICAgICAgICAgICAgICAgIGFjdGlvbjogbnVsbCxcbiAgICAgICAgICAgICAgICBmb3JtOiAnJyxcbiAgICAgICAgICAgICAgICBtb3JlQnRuOiAkKCksXG4gICAgICAgICAgICAgICAgcmVzdWx0czogbnVsbCxcbiAgICAgICAgICAgICAgICBkb2luZ19hamF4OiBudWxsLFxuICAgICAgICAgICAgICAgIHRpbWVvdXQ6IG51bGwsXG4gICAgICAgICAgICAgICAgcXVlcnk6IHtcbiAgICAgICAgICAgICAgICAgICAgcG9zdF90eXBlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBwZXJfcGFnZTogOSxcbiAgICAgICAgICAgICAgICAgICAgcGFnZTogMSxcbiAgICAgICAgICAgICAgICAgICAgbWFpbl90YXhvbm9teTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgY29udGVudF90eXBlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICByZWdpb246IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIGxhbmd1YWdlOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBzZWFyY2g6IG51bGwsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjb21wb25lbnRfc3R5bGVzOiB7fSxcbiAgICAgICAgICAgICAgICBhamF4X3VybDogZHMuYWpheF91cmwsXG4gICAgICAgICAgICAgICAgcHJlbG9hZGVyOiAnPGRpdiBjbGFzcz1cImZpbHRlci1sb2FkZXIgbG9hZGVyXCI+PGRpdiBjbGFzcz1cInNwaW5uZXJcIj48ZGl2IGNsYXNzPVwiZG91YmxlLWJvdW5jZTFcIj48L2Rpdj48ZGl2IGNsYXNzPVwiZG91YmxlLWJvdW5jZTJcIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwibG9hZGVyLWJnXCI+PC9kaXY+PC9kaXY+JyxcbiAgICAgICAgICAgICAgICBpbml0KG1vZHVsZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBhamF4TW9kdWxlID0gJChtb2R1bGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhamF4TW9kdWxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIubW9kdWxlID0gYWpheE1vZHVsZTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyLmFjdGlvbiA9IGFqYXhNb2R1bGUuZGF0YSgnYWN0aW9uJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIucXVlcnkucG9zdF90eXBlID0gYWpheE1vZHVsZS5kYXRhKCdwb3N0LXR5cGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlci5xdWVyeS5wb3N0c19wZXJfcGFnZSA9IGFqYXhNb2R1bGUuZGF0YSgncGVyLXBhZ2UnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlci5xdWVyeS5tYWluX3RheG9ub215ID0gYWpheE1vZHVsZS5kYXRhKCdtYWluLXRheG9ub215Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIucXVlcnkuY29udGVudF90eXBlID0gYWpheE1vZHVsZS5kYXRhKCdjb250ZW50LXR5cGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlci5xdWVyeS5yZWdpb24gPSBhamF4TW9kdWxlLmRhdGEoJ3JlZ2lvbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyLnF1ZXJ5Lmxhbmd1YWdlID0gYWpheE1vZHVsZS5kYXRhKCdsYW5ndWFnZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQuVVJMLmluZGV4T2YoJz8nKSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyLnF1ZXJ5LnNlYXJjaCA9IHBhcmFtcy5nZXQoJ3MnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyLmluaXRFbGVtZW50c0FjdGlvbnMoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBpbml0RWxlbWVudHNBY3Rpb25zKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHRzID0gZmlsdGVyLm1vZHVsZS5maW5kKCdkaXZbZGF0YS1jb250YWluZXI9XCJhamF4LXJlc3VsdFwiXScpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIucmVzdWx0cyA9IHJlc3VsdHM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1vcmVCdG4gPSBmaWx0ZXIubW9kdWxlLmZpbmQoJy5hamF4LWxvYWQtbW9yZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1vcmVCdG4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIubW9yZUJ0biA9IG1vcmVCdG47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyLm1vcmVQb3N0cygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3JtID0gZmlsdGVyLm1vZHVsZS5maW5kKCdmb3JtW2RhdGEtZm9ybT1cImFqYXhcIl0nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmb3JtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyLmZvcm0gPSBmb3JtO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlci5jaGFuZ2VGb3JtKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb21wQ2xhc3MgPSBmaWx0ZXIubW9kdWxlLmRhdGEoJ2NsYXNzJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wQ2xhc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlci5jb21wb25lbnRfc3R5bGVzLmNsYXNzID0gY29tcENsYXNzO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29tcFN0eWxlcyA9IGZpbHRlci5tb2R1bGUuZGF0YSgnc3R5bGVzJyk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb21wU3R5bGVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIuY29tcG9uZW50X3N0eWxlcy5zdHlsZXMgPSBjb21wU3R5bGVzO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29tcEltYWdlID0gZmlsdGVyLm1vZHVsZS5kYXRhKCdpbWFnZScpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29tcEltYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIuY29tcG9uZW50X3N0eWxlcy5pbWFnZSA9IGNvbXBJbWFnZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbW9yZVBvc3RzKCkge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXIubW9yZUJ0bi5vbignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIuc2VuZEFqYXgoZmlsdGVyLnF1ZXJ5LnBhZ2UsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjaGFuZ2VGb3JtKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCAkaW5wdXRfdGV4dCA9IGZpbHRlci5mb3JtLmZpbmQoJ2lucHV0W3R5cGU9XCJ0ZXh0XCJdLCB0ZXh0YXJlYScpO1xuICAgICAgICAgICAgICAgICAgICAkaW5wdXRfdGV4dC51bmJpbmQoJ2tleXVwJyk7XG4gICAgICAgICAgICAgICAgICAgICRpbnB1dF90ZXh0Lm5vdCgnW2RhdGEtYWpheD1cImZhbHNlXCJdJykua2V5dXAoKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmlsdGVyLnRpbWVvdXQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dChmaWx0ZXIudGltZW91dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIudGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlci50aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIuc2VuZEFqYXgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW5wdXRfc3VibWl0LnBhcmVudCgpLmFkZENsYXNzKCdpcy1maWx0ZXItYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgJGlucHV0X3N1Ym1pdCA9IGZpbHRlci5mb3JtLmZpbmQoJ2J1dHRvblt0eXBlPVwic3VibWl0XCJdJyk7XG4gICAgICAgICAgICAgICAgICAgICRpbnB1dF9zdWJtaXQudW5iaW5kKCdjbGljaycpO1xuICAgICAgICAgICAgICAgICAgICAkaW5wdXRfc3VibWl0Lm5vdCgnW2RhdGEtYWpheD1cImZhbHNlXCJdJykuY2xpY2soKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlci5zZW5kQWpheCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJGlucHV0X3N1Ym1pdC5wYXJlbnQoKS5hZGRDbGFzcygnaXMtZmlsdGVyLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCAkc2VsZWN0ID0gZmlsdGVyLmZvcm0uZmluZCgnc2VsZWN0Jyk7XG4gICAgICAgICAgICAgICAgICAgICRzZWxlY3QudW5iaW5kKCdjaGFuZ2UnKTtcbiAgICAgICAgICAgICAgICAgICAgJHNlbGVjdC5ub3QoJ1tkYXRhLWFqYXg9XCJmYWxzZVwiXScpLmNoYW5nZSgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIuc2VuZEFqYXgoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgJHNlbGVjdC5maWx0ZXIoJ1tkYXRhLXRhcmdldD1cImlucHV0XCJdJykuY2hhbmdlKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgJGN1cnJlbnRJdGVtID0gJChlLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgJGlucHV0VGFyZ2V0ID0gZmlsdGVyLmZvcm0uZmluZChgaW5wdXQuJHsgJGN1cnJlbnRJdGVtLmRhdGEoJ3RhcmdldC1uYW1lJykgfWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRpbnB1dFRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCAkc2VsZWN0ZWRPcHRpb24gPSAkY3VycmVudEl0ZW0uZmluZCgnb3B0aW9uOnNlbGVjdGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGlucHV0VGFyZ2V0LnZhbCgkc2VsZWN0ZWRPcHRpb24udmFsKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpbnB1dFRhcmdldC5kYXRhKCdwdXNoLXVybCcsICRzZWxlY3RlZE9wdGlvbi5kYXRhKCd0ZXJtLXVybCcpKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlci5zZW5kQWpheCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAkc2VsZWN0LmZpbHRlcignW2RhdGEtdGFyZ2V0PVwidWxcIl0nKS5jaGFuZ2UoKGUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCAkY3VycmVudEl0ZW0gPSAkKGUudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlci5mb3JtLmZpbmQoYHVsLiR7ICRjdXJyZW50SXRlbS5kYXRhKCd0YXJnZXQtbmFtZScpIH1gKS5maW5kKGBsaSBhW2RhdGEtdGVybS1zbHVnPVwiJHsgJGN1cnJlbnRJdGVtLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnZhbCgpIH1cIl1gKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgO1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyLnNlbmRBamF4KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0ICRsaXN0ID0gZmlsdGVyLmZvcm0uZmluZCgndWxbZGF0YS1hamF4LXB1c2gtdXJsPVwidHJ1ZVwiXScpLmZpcnN0KCk7XG4gICAgICAgICAgICAgICAgICAgICRsaXN0LnVuYmluZCgnY2hhbmdlJyk7XG4gICAgICAgICAgICAgICAgICAgICRsaXN0LmZpbmQoJ2xpIGEnKS5jbGljaygoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJGxpc3QuZmluZCgnbGkgYScpLnJlbW92ZUNsYXNzKCdhY3RpdmVfdGVybScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0ICRhY3RpdmVUZXJtID0gJChlLnRhcmdldCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkYWN0aXZlVGVybS5hZGRDbGFzcygnYWN0aXZlX3Rlcm0nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0ICRpbnB1dFRhcmdldCA9IGZpbHRlci5mb3JtLmZpbmQoYGlucHV0LiR7ICRsaXN0LmRhdGEoJ3RhcmdldC1uYW1lJykgfWApO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRpbnB1dFRhcmdldCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpbnB1dFRhcmdldC52YWwoJGFjdGl2ZVRlcm0uZGF0YSgndGVybS1zbHVnJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRpbnB1dFRhcmdldC5kYXRhKCdwdXNoLXVybCcsICRhY3RpdmVUZXJtLmF0dHIoJ2hyZWYnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyLmZvcm0uZmluZChgc2VsZWN0LiR7ICRsaXN0LmRhdGEoJ3RhcmdldC1uYW1lJykgfSBvcHRpb25bdmFsdWU9XCIkeyAkYWN0aXZlVGVybS5kYXRhKCd0ZXJtLXNsdWcnKSB9XCJdYCk/LnByb3AoJ3NlbGVjdGVkJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIuc2VuZEFqYXgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyLmZvcm0udW5iaW5kKCdrZXlkb3duJyk7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlci5mb3JtLm9uKCdkc190cmlnZ2VyX2Jyb3dzZXJfYnV0dG9uX3VzZWQnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIuc2VuZEFqYXgoMCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNlbmRBamF4KHBhZ2UgPSAwLCBwdXNoX3N0YXRlID0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsdGVyLmRvaW5nX2FqYXggIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyLmRvaW5nX2FqYXguYWJvcnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlci5kb2luZ19hamF4ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlci5tb2R1bGUuZmluZCgnLmxvYWRlcicpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb246IGZpbHRlci5hY3Rpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBxdWVyeToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RfdHlwZTogZmlsdGVyLnF1ZXJ5LnBvc3RfdHlwZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0c19wZXJfcGFnZTogZmlsdGVyLnF1ZXJ5LnBvc3RzX3Blcl9wYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2VkOiBwYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1haW5fdGF4b25vbXk6IGZpbHRlci5xdWVyeS5tYWluX3RheG9ub215LFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudF90eXBlOiBmaWx0ZXIucXVlcnkuY29udGVudF90eXBlLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVnaW9uOiBmaWx0ZXIucXVlcnkucmVnaW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFuZ3VhZ2U6IGZpbHRlci5xdWVyeS5sYW5ndWFnZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHM6IGZpbHRlci5xdWVyeS5zZWFyY2gsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnQ6IGZpbHRlci5jb21wb25lbnRfc3R5bGVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlOiAkKHdpbmRvdykud2lkdGgoKSA8PSA3NjggPyAnbW9iaWxlJyA6ICdkZXNrdG9wJyxcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsdGVyLmZvcm0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5mb3JtID0gZmlsdGVyLmZvcm0uc2VyaWFsaXplKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXIuZG9pbmdfYWpheCA9ICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IGZpbHRlci5hamF4X3VybCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBiZWZvcmVTZW5kKHhocikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlci5tb2R1bGUuYXBwZW5kKGZpbHRlci5wcmVsb2FkZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwdXNoX3N0YXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlci5idWlsZF91cmwoZGF0YS5xdWVyeS5wYWdlZCwgcHVzaF9zdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3MoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEucGFnZSA9PT0gMSkgZmlsdGVyLnJlc3VsdHMuaHRtbCgnJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyLnJlc3VsdHMuYXBwZW5kKGRhdGEucG9zdHMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLm1heF9wYWdlcyA9PT0gZGF0YS5wYWdlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIubW9yZUJ0bi5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIubW9yZUJ0bi5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS50b3RhbF9wb3N0c19zaG93aW5nID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIubW9kdWxlLmZpbmQoJy5qcy1ibG9nLWNvdW50ZXItd3JhcHBlcicpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlci5tb2R1bGUuZmluZCgnLmpzLWJsb2ctY291bnRlci13cmFwcGVyJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEudG90YWxfcG9zdHNfc2hvd2luZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyLm1vZHVsZS5maW5kKCcuanMtYmxvZy1jb3VudGVyLXNob3dpbmcnKS50ZXh0KGRhdGEudG90YWxfcG9zdHNfc2hvd2luZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS50b3RhbF9wb3N0cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyLm1vZHVsZS5maW5kKCcuanMtYmxvZy1jb3VudGVyLXRvdGFsJykudGV4dChkYXRhLnRvdGFsX3Bvc3RzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlci5xdWVyeS5wYWdlID0gZGF0YS5wYWdlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIubW9yZUJ0bi5hdHRyKCdkYXRhLXBhZ2UnLCBkYXRhLnBhZ2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIubW9kdWxlLmZpbmQoJy5sb2FkZXInKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXIubW9yZUJ0bi5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyLmRvaW5nX2FqYXggPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBidWlsZF91cmwocGFnZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVybF9wYXJzZV9zaWRlID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoXCI/XCIpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgdXJsID0gbmV3IFVSTCh1cmxfcGFyc2Vfc2lkZVswXSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvbGRVcmwgPSBuZXcgVVJMKHdpbmRvdy5oaXN0b3J5LnN0YXRlICYmIHdpbmRvdy5oaXN0b3J5LnN0YXRlLnBhdGggPyB3aW5kb3cuaGlzdG9yeS5zdGF0ZS5wYXRoIDogd2luZG93LmxvY2F0aW9uLmhyZWYpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcHVzaF9zdGF0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW5wdXRQdXNoVXJsID0gZmlsdGVyLmZvcm0uZmluZCgnaW5wdXRbZGF0YS1wdXNoLXVybF0nKS5maXJzdCgpLmRhdGEoJ3B1c2gtdXJsJykgPz8gJyc7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dFB1c2hVcmwgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwdXNoX3N0YXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybC5ocmVmID0gaW5wdXRQdXNoVXJsO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyLmZvcm0uZmluZCgnaW5wdXRbdHlwZT10ZXh0XTpub3QoW2RhdGEtYWpheD1cImZhbHNlXCJdKScpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHVzaF9zdGF0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoalF1ZXJ5KHRoaXMpLnZhbCgpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmwuc2VhcmNoUGFyYW1zLnNldChqUXVlcnkodGhpcykuYXR0cignbmFtZScpLCBqUXVlcnkodGhpcykudmFsKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXIuZm9ybS5maW5kKCdzZWxlY3Q6bm90KFtkYXRhLWFqYXg9XCJmYWxzZVwiXSknKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hfc3RhdGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGpRdWVyeSh0aGlzKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS52YWwoKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsLnNlYXJjaFBhcmFtcy5zZXQoalF1ZXJ5KHRoaXMpLmF0dHIoJ25hbWUnKSwgalF1ZXJ5KHRoaXMpLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnZhbCgpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGVjb2RlZF91cmwgPSBkZWNvZGVVUklDb21wb25lbnQodXJsKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHB1c2hfc3RhdGUgJiYgKG9sZFVybC5zZWFyY2hQYXJhbXMudG9TdHJpbmcoKSAhPT0gdXJsLnNlYXJjaFBhcmFtcy50b1N0cmluZygpIHx8IG9sZFVybC5ocmVmICE9PSB1cmwuaHJlZikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh7ICdwYXRoJzogZGVjb2RlZF91cmwsICdkc190cmlnZ2VyX2ZpbHRlcic6IHRydWUgfSwgbnVsbCwgZGVjb2RlZF91cmwpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGZpbHRlci5pbml0KG1vZHVsZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgZG9Jbml0ID0gKCkgPT4ge1xuXG4gICAgICAgICAgICAkKCcuanMtYWpheC1ibG9jaycpLmVhY2goKGkpID0+IHtcbiAgICAgICAgICAgICAgICBEU0luaXRGaWx0ZXIoJCgnLmpzLWFqYXgtYmxvY2snKVtpXSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIGRvSW5pdCgpO1xuXG4gICAgICAgIGFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgZXZlbnQgPT4ge1xuICAgICAgICAgICAgJCgnLmpzLWFqYXgtYmxvY2snKS5lYWNoKChpLCBpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVJbml0RmlsdGVyKGl0ZW0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG5cbiAgICB9KGpRdWVyeSkpO1xuXG59XG5cbmNvbnN0IHJlSW5pdEZpbHRlciA9IChmaWx0ZXIpID0+IHtcbiAgICBjb25zdCBwYXJzZWRVcmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdChcIj9cIik7XG4gICAgY29uc3QgY3VycmVudFVybCA9IG5ldyBVUkwod2luZG93LmxvY2F0aW9uLmhyZWYudG9TdHJpbmcoKSk7XG4gICAgY29uc3QgY2xlYW5lZFVybCA9IG5ldyBVUkwocGFyc2VkVXJsWzBdKTtcblxuICAgIGxldCBwYXJhbXMgPSBjdXJyZW50VXJsLnNlYXJjaFBhcmFtcztcbiAgICBsZXQgdHJpZ2dlckNoYW5nZSA9IGZhbHNlO1xuICAgIGNvbnN0IGZvcm0gPSAkKGZpbHRlcikuZmluZCgnZm9ybVtkYXRhLWZvcm09XCJhamF4XCJdJyk7XG5cbiAgICBmb3JtLmZpbmQoJ2lucHV0W3R5cGU9dGV4dF06bm90KFtkYXRhLWFqYXg9XCJmYWxzZVwiXSknKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWxlbSkge1xuICAgICAgICBsZXQgJHRoaXMgPSAkKGVsZW0pO1xuICAgICAgICAkdGhpcy52YWwocGFyYW1zLmdldCgkdGhpcy5hdHRyKCduYW1lJykpID8/ICcnKTtcbiAgICAgICAgdHJpZ2dlckNoYW5nZSA9IHRydWVcbiAgICB9KTtcblxuICAgIGZvcm0uZmluZCgnc2VsZWN0Om5vdChbZGF0YS1hamF4PVwiZmFsc2VcIl0pJykuZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsZW0pIHtcbiAgICAgICAgbGV0ICR0aGlzID0gJChlbGVtKTtcbiAgICAgICAgbGV0IHZhbHVlID0gcGFyYW1zLmdldCgkdGhpcy5hdHRyKCduYW1lJykpID8/ICcnO1xuICAgICAgICBpZiAodmFsdWUgIT09ICcnKSB7XG4gICAgICAgICAgICAkdGhpcy5maW5kKGBvcHRpb25bdmFsdWU9JHsgdmFsdWUgfV1gKS5wcm9wKCdzZWxlY3RlZCcsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJHRoaXMuZmluZCgnb3B0aW9uOmVxKDApJykucHJvcCgnc2VsZWN0ZWQnLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICB0cmlnZ2VyQ2hhbmdlID0gdHJ1ZVxuICAgIH0pO1xuXG4gICAgZm9ybS5maW5kKCd1bFtkYXRhLWFqYXgtcHVzaC11cmw9XCJ0cnVlXCJdOmZpcnN0IGxpIGEnKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWxlbSkge1xuICAgICAgICBsZXQgJHRoaXMgPSAkKGVsZW0pO1xuICAgICAgICBpZiAoJHRoaXMuYXR0cignaHJlZicpID09PSBjbGVhbmVkVXJsLmhyZWYgJiYgISR0aGlzLmhhc0NsYXNzKCdhY3RpdmVfdGVybScpKSB7XG4gICAgICAgICAgICAkdGhpcy50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgdHJpZ2dlckNoYW5nZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGZvcm0uZmluZCgnc2VsZWN0W2RhdGEtdGFyZ2V0PVwiaW5wdXRcIl0nKS5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWxlbSkge1xuICAgICAgICBsZXQgJHRoaXMgPSAkKGVsZW0pO1xuICAgICAgICBsZXQgc2VsZWN0ZWRPcHRpb24gPSAkdGhpcy5maW5kKCdvcHRpb246c2VsZWN0ZWQnKTtcbiAgICAgICAgbGV0ICRpbnB1dFRhcmdldCA9IGZvcm0uZmluZChgaW5wdXQuJHsgJHRoaXMuZGF0YSgndGFyZ2V0LW5hbWUnKSB9YCk7XG5cbiAgICAgICAgaWYgKHNlbGVjdGVkT3B0aW9uLmRhdGEoJ3Rlcm0tdXJsJykgIT09IGNsZWFuZWRVcmwuaHJlZikge1xuICAgICAgICAgICAgJHRoaXMuZmluZChgb3B0aW9uW2RhdGEtdGVybS11cmw9XCIkeyBjbGVhbmVkVXJsLmhyZWYgfVwiXWApLnByb3AoJ3NlbGVjdGVkJywgdHJ1ZSk7XG5cbiAgICAgICAgICAgIGxldCAkbmV3U2VsZWN0ZWRPcHRpb24gPSAkdGhpcy5maW5kKCdvcHRpb246c2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICRpbnB1dFRhcmdldC52YWwoJG5ld1NlbGVjdGVkT3B0aW9uLnZhbCgpKTtcbiAgICAgICAgICAgICRpbnB1dFRhcmdldC5kYXRhKCdwdXNoLXVybCcsICRuZXdTZWxlY3RlZE9wdGlvbi5kYXRhKCd0ZXJtLXVybCcpKTtcbiAgICAgICAgICAgIHRyaWdnZXJDaGFuZ2UgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgIGlmICh0cmlnZ2VyQ2hhbmdlKSB7XG4gICAgICAgIGZvcm0udHJpZ2dlcignZHNfdHJpZ2dlcl9icm93c2VyX2J1dHRvbl91c2VkJyk7XG4gICAgfVxufVxuXG5leHBvcnQge1xuICAgIGRzX2xvYWRNb3JlQmxvZyxcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBjb3JyZWN0Q2xpcFBhdGgoKSB7XG5cdHdpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgYmFzZUhlaWdodCA9IDQ3Mztcblx0XHQvLyB2YXIgYmFzZVdpZHRoID0gYmFzZUhlaWdodCAqIDAuMzQ1O1xuXHRcdHZhciBiYXNlV2lkdGggPSBiYXNlSGVpZ2h0ICogMC4zNDUgKiAyLjI1O1xuXG5cdFx0dmFyIGltYWdlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tLWJsb2NrLmFic29sdXRlLW1lZGlhIC5jLWltYWdlX19tZWRpYS5jLWltYWdlX19wcmltYXJ5ID4gaW1nJyk7XG5cblx0XHRpbWFnZXMuZm9yRWFjaChmdW5jdGlvbihpbWcpIHtcblx0XHRcdHNldENsaXBQYXRoKGltZywgYmFzZVdpZHRoLCBiYXNlSGVpZ2h0KTtcblx0XHR9KTtcblxuXHRcdHdpbmRvdy5vbnJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aW1hZ2VzLmZvckVhY2goZnVuY3Rpb24oaW1nKSB7XG5cdFx0XHRcdHNldENsaXBQYXRoKGltZywgYmFzZVdpZHRoLCBiYXNlSGVpZ2h0KTtcblx0XHRcdH0pO1xuXHRcdH07XG5cdH07XG5cblx0ZnVuY3Rpb24gc2V0Q2xpcFBhdGgoaW1nLCBiYXNlV2lkdGgsIGJhc2VIZWlnaHQpIHtcblx0XHR2YXIgaW1hZ2VIZWlnaHQgPSBpbWcuY2xpZW50SGVpZ2h0O1xuXHRcdHZhciBwcm9wb3J0aW9uYWxXaWR0aCA9IChiYXNlV2lkdGggLyBiYXNlSGVpZ2h0KSAqIGltYWdlSGVpZ2h0O1xuXHRcdHZhciBjbGlwUGF0aFZhbHVlID0gKHByb3BvcnRpb25hbFdpZHRoIC8gaW1nLmNsaWVudFdpZHRoICogMTAwKSArICclIDAlLCAxMDAlIDAlLCAxMDAlIDEwMCUsIDAlIDEwMCUnO1xuXG5cdFx0aW1nLnN0eWxlLmNsaXBQYXRoID0gJ3BvbHlnb24oJyArIGNsaXBQYXRoVmFsdWUgKyAnKSc7XG5cdH1cbn1cbiIsIi8qKlxuICogU2ltcGxlIEltYWdlIFNwaW5uZXJcbiAqL1xuaW1wb3J0IHsgcmVnaXN0ZXJQbGF5YmFja0NvbnRyb2xQbHVnaW4gfSBmcm9tICcuLi8uLi9saWJyYXJ5LzNkLW1lZGlhL3NwaW5uZXItcGx1Z2lucy9jdHJsLXBsYXliYWNrLXBsdWdpbic7XG5pbXBvcnQgeyByZWdpc3RlckZyYW1lc05hdkNvbnRyb2xQbHVnaW4gfSBmcm9tICcuLi8uLi9saWJyYXJ5LzNkLW1lZGlhL3NwaW5uZXItcGx1Z2lucy9jdHJsLWZyYW1lcy1uYXYtcGx1Z2luJztcbmltcG9ydCB7IHJlZ2lzdGVyWm9vbUNvbnRyb2xQbHVnaW4gfSBmcm9tICcuLi8uLi9saWJyYXJ5LzNkLW1lZGlhL3NwaW5uZXItcGx1Z2lucy9jdHJsLXpvb20tcGx1Z2luJztcbmltcG9ydCB7IHJlZ2lzdGVyRnVsbHNjckNvbnRyb2xQbHVnaW4gfSBmcm9tICcuLi8uLi9saWJyYXJ5LzNkLW1lZGlhL3NwaW5uZXItcGx1Z2lucy9jdHJsLWZ1bGxzY3JlZW4tcGx1Z2luJztcbmltcG9ydCB7IHJlZ2lzdGVyUHJvZ3Jlc3NGcmFjdGlvblBsdWdpbiB9IGZyb20gJy4uLy4uL2xpYnJhcnkvM2QtbWVkaWEvc3Bpbm5lci1wbHVnaW5zL3Byb2dyZXNzLWZyYWN0aW9uLXBsdWdpbic7XG5pbXBvcnQgeyByZWdpc3RlckhvdFNwb3RzUGx1Z2luIH0gZnJvbSAnLi4vLi4vbGlicmFyeS8zZC1tZWRpYS9zcGlubmVyLXBsdWdpbnMvaG90c3BvdHMtcGx1Z2luJztcbmltcG9ydCB7IGlzRHJhZ09uIH0gZnJvbSAnLi4vLi4vbGlicmFyeS8zZC1tZWRpYS9zcGlubmVyLXBsdWdpbnMvY3RybC1kcmFnLXBsdWdpbic7XG5pbXBvcnQgeyBpc1BsYXliYWNrT24gfSBmcm9tICcuLi8uLi9saWJyYXJ5LzNkLW1lZGlhL3NwaW5uZXItY29udHJvbHMvcGxheWJhY2snO1xuaW1wb3J0IHsgaXNGcmFtZXNOYXZPbiB9IGZyb20gJy4uLy4uL2xpYnJhcnkvM2QtbWVkaWEvc3Bpbm5lci1jb250cm9scy9mcmFtZXMtbmF2JztcbmltcG9ydCB7IGlzWm9vbU9uIH0gZnJvbSAnLi4vLi4vbGlicmFyeS8zZC1tZWRpYS9zcGlubmVyLWNvbnRyb2xzL3pvb20nO1xuaW1wb3J0IHsgaXNGdWxsU2NyZWVuT24gfSBmcm9tICcuLi8uLi9saWJyYXJ5LzNkLW1lZGlhL3NwaW5uZXItY29udHJvbHMvZnVsbHNjcmVlbic7XG5pbXBvcnQgeyBpc0ZyYWN0aW9uT24gfSBmcm9tICcuLi8uLi9saWJyYXJ5LzNkLW1lZGlhL3NwaW5uZXItY29udHJvbHMvcHJvZ3Jlc3MtZnJhY3Rpb24nO1xuaW1wb3J0IHsgaXNBbmltYXRlT24gfSBmcm9tICcuLi8uLi9saWJyYXJ5LzNkLW1lZGlhL3NwaW5uZXItY29udHJvbHMvYXV0b2FuaW1hdGUnO1xuaW1wb3J0IHsgaXNIb3RzcG90c09uIH0gZnJvbSAnLi4vLi4vbGlicmFyeS8zZC1tZWRpYS9zcGlubmVyLWNvbnRyb2xzL2hvdHNwb3RzLW5hdic7XG5cbi8vIGNvbmZpZyBzZWxlY3RvcnNcbmNvbnN0IHNwaW5uZXJFbGVtTmFtZSA9ICdqcy1pbWFnZS1zcGlubmVyJztcbmNvbnN0IHNwaW5uZXJNb2R1bGVXcmFwID0gJy5tLWltYWdlLXNwaW5uZXInO1xuXG4vLyBnZXQgYWxsIHNwaW5uZXJzXG5jb25zdCBzcGlubmVyTW9kdWxlTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc3Bpbm5lck1vZHVsZVdyYXApO1xuXG5jb25zdCBjYWxsSW1hZ2VTcGlubmVycyA9ICgpID0+IHtcblxuICAgIGlmICghc3Bpbm5lck1vZHVsZUxpc3QubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzcGlubmVyT3B0aW9ucyA9IFtdO1xuXG4gICAgLy8gbG9vcCB0aHJvdWdoIHNwaW5uZXJzIGFuZCBhc3NpZ24gdGhlbSBJRHNcbiAgICBzcGlubmVyTW9kdWxlTGlzdC5mb3JFYWNoKChzcGlubmVyTW9kdWxlLCBpKSA9PiB7XG4gICAgICAgIGNvbnN0IGltZ1NwaW5uZXJFbGVtID0gc3Bpbm5lck1vZHVsZS5xdWVyeVNlbGVjdG9yKCcuanMtaW1hZ2Utc3Bpbm5lcicpO1xuICAgICAgICBjb25zdCBpbWdQYXRoID0gc3Bpbm5lck1vZHVsZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3Bpbm5lci1wYXRoJyk7XG4gICAgICAgIGNvbnN0IGltZ1ByZWZpeCA9IHNwaW5uZXJNb2R1bGUuZ2V0QXR0cmlidXRlKCdkYXRhLXNwaW5uZXItcHJlZml4Jyk7XG4gICAgICAgIGNvbnN0IGltZ0RpZ2l0cyA9IHNwaW5uZXJNb2R1bGUuZ2V0QXR0cmlidXRlKCdkYXRhLXNwaW5uZXItZGlnaXRzJyk7XG4gICAgICAgIGNvbnN0IGltZ0NvdW50ID0gc3Bpbm5lck1vZHVsZS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc3Bpbm5lci1jb3VudCcpO1xuICAgICAgICBjb25zdCBpbWdFeHQgPSBzcGlubmVyTW9kdWxlLmdldEF0dHJpYnV0ZSgnZGF0YS1zcGlubmVyLWV4dCcpO1xuXG4gICAgICAgIGlmICghKGltZ1BhdGggfHwgaW1nUHJlZml4IHx8IGltZ0RpZ2l0cyB8fCBpbWdDb3VudCB8fCBpbWdFeHQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzcGlubmVySUQgPSBgJHtzcGlubmVyRWxlbU5hbWV9LSR7aX1gO1xuICAgICAgICBpbWdTcGlubmVyRWxlbS5zZXRBdHRyaWJ1dGUoJ2lkJywgc3Bpbm5lcklEKTtcblxuICAgICAgICBzcGlubmVyT3B0aW9uc1tpXSA9IHtcbiAgICAgICAgICAgIHNvdXJjZTogU3ByaXRlU3Bpbi5zb3VyY2VBcnJheShpbWdQYXRoICsgJy8nICsgaW1nUHJlZml4ICsgJ3tmcmFtZX0uJyArIGltZ0V4dCwge1xuICAgICAgICAgICAgICAgIGZyYW1lOiBbMSwgaW1nQ291bnRdLFxuICAgICAgICAgICAgICAgIGRpZ2l0czogaW1nRGlnaXRzXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIC8vIHVzZSBkb3VibGUgY2xpY2sgdG8gaW4vb3V0IChkZWZhdWx0IGlzIHRydWUpXG4gICAgICAgICAgICB6b29tVXNlQ2xpY2s6IHRydWUsXG4gICAgICAgICAgICAvLyBwcmV2ZW50cyBjaGFuZ2luZyB0aGUgZnJhbWUgZHVyaW5nIHpvb20gKGRlZmF1bHQgaXMgdHJ1ZSlcbiAgICAgICAgICAgIHpvb21QaW5GcmFtZTogZmFsc2UsXG4gICAgICAgICAgICBzZW5zZTogLTEsXG4gICAgICAgICAgICByZXNwb25zaXZlOiB0cnVlLFxuICAgICAgICAgICAgYW5pbWF0ZTogZmFsc2UsXG4gICAgICAgICAgICBzaXplTW9kZTogJ2ZpdCcsXG4gICAgICAgICAgICByZW5kZXJlcjogJ2NhbnZhcycsXG4gICAgICAgICAgICBwcmVsb2FkQ291bnQ6IDIsXG4gICAgICAgICAgICAvLyBhbmltYXRpb24gc3BlZWRcbiAgICAgICAgICAgIGZyYW1lVGltZTogMTIwLFxuICAgICAgICAgICAgcGxheVRvRnJhbWVUaW1lOiAxMCxcbiAgICAgICAgICAgIHJldmVyc2U6IGZhbHNlLFxuICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHRvIHVzZSB0aGUgc2FtZSB2YWx1ZSBmb3IgZm9yY2VSZXZlcnNlLCBpbiBjYXNlIGl0IGdldHMgY2hhbmdlZCBieSAnbmVhcmVzdCcgZnJhbWUgaHMgb3B0aW9uXG4gICAgICAgICAgICBmb3JjZVJldmVyc2U6IGZhbHNlLFxuICAgICAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgICAgICAgICczNjAnLCAvLyBkaXNwbGF5IHBsdWdpblxuICAgICAgICAgICAgICAgIC8vICAgICdkcmFnJywgLy8gaW50ZXJhY3Rpb24gcGx1Z2luIC0gb3B0aW9uYWwgcGVyIG1vZHVsZSBzZXR0aW5nc1xuICAgICAgICAgICAgICAgIC8vIG5hdGl2ZSB6b29tIHBsdWdpbiBpcyB0cmlnZ2VyZWQgdmlhIGRzWm9vbUNvbnRyb2xcbiAgICAgICAgICAgICAgICAvLyAgICAnem9vbScsXG4gICAgICAgICAgICBdXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gcGx1Z2luc1xuICAgICAgICBzcGlubmVyT3B0aW9uc1tpXSA9IGlzRnJhY3Rpb25PbihzcGlubmVyTW9kdWxlLCBzcGlubmVyT3B0aW9uc1tpXSk7XG4gICAgICAgIHNwaW5uZXJPcHRpb25zW2ldID0gaXNGcmFtZXNOYXZPbihzcGlubmVyTW9kdWxlLCBzcGlubmVyT3B0aW9uc1tpXSk7XG4gICAgICAgIHNwaW5uZXJPcHRpb25zW2ldID0gaXNab29tT24oc3Bpbm5lck1vZHVsZSwgc3Bpbm5lck9wdGlvbnNbaV0pO1xuICAgICAgICBzcGlubmVyT3B0aW9uc1tpXSA9IGlzRnVsbFNjcmVlbk9uKHNwaW5uZXJNb2R1bGUsIHNwaW5uZXJPcHRpb25zW2ldKTtcbiAgICAgICAgc3Bpbm5lck9wdGlvbnNbaV0gPSBpc1BsYXliYWNrT24oc3Bpbm5lck1vZHVsZSwgc3Bpbm5lck9wdGlvbnNbaV0pO1xuICAgICAgICBzcGlubmVyT3B0aW9uc1tpXSA9IGlzSG90c3BvdHNPbihzcGlubmVyTW9kdWxlLCBzcGlubmVyT3B0aW9uc1tpXSk7XG4gICAgICAgIHNwaW5uZXJPcHRpb25zW2ldID0gaXNEcmFnT24oc3Bpbm5lck1vZHVsZSwgc3Bpbm5lck9wdGlvbnNbaV0pO1xuXG4gICAgICAgIC8vIG90aGVyIG9wdGlvbnNcbiAgICAgICAgc3Bpbm5lck9wdGlvbnNbaV0gPSBpc0FuaW1hdGVPbihzcGlubmVyTW9kdWxlLCBzcGlubmVyT3B0aW9uc1tpXSk7XG5cbiAgICAgICAgYm9vdEltYWdlU3Bpbm5lcihgIyR7c3Bpbm5lcklEfWAsIHNwaW5uZXJPcHRpb25zW2ldKTtcbiAgICB9KTtcblxuICAgIHJlZ2lzdGVyUGxheWJhY2tDb250cm9sUGx1Z2luKCdkc1BsYXliYWNrQ29udHJvbCcpO1xuICAgIHJlZ2lzdGVyRnJhbWVzTmF2Q29udHJvbFBsdWdpbignZHNGcmFtZXNOYXZDb250cm9sJyk7XG4gICAgcmVnaXN0ZXJab29tQ29udHJvbFBsdWdpbignZHNab29tQ29udHJvbCcpO1xuICAgIHJlZ2lzdGVyRnVsbHNjckNvbnRyb2xQbHVnaW4oJ2RzRnVsbFNjcmVlbkNvbnRyb2wnKTtcbiAgICByZWdpc3RlclByb2dyZXNzRnJhY3Rpb25QbHVnaW4oJ2RzUHJvZ3Jlc3NGcmFjdGlvbicpO1xuICAgIHJlZ2lzdGVySG90U3BvdHNQbHVnaW4oJ2RzSG90U3BvdHMnKTtcbn07XG5cbmZ1bmN0aW9uIGJvb3RJbWFnZVNwaW5uZXIoc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICBpZiAoXCJJbnRlcnNlY3Rpb25PYnNlcnZlclwiIGluIHdpbmRvdykge1xuICAgICAgICAvLyBCcm93c2VyIHN1cHBvcnRzIEludGVyc2VjdGlvbk9ic2VydmVyIHNvIHVzZSB0aGF0IHRvIGRlZmVyIHRoZSBib290XG4gICAgICAgIGxldCBvYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcihmdW5jdGlvbihlbnRyaWVzLCBvYnNlcnZlcikge1xuICAgICAgICAgICAgZW50cmllcy5mb3JFYWNoKGZ1bmN0aW9uKGVudHJ5KSB7XG4gICAgICAgICAgICAgICAgaWYgKGVudHJ5LmlzSW50ZXJzZWN0aW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLnVub2JzZXJ2ZShlbnRyeS50YXJnZXQpO1xuXG4gICAgICAgICAgICAgICAgICAgICQoZW50cnkudGFyZ2V0KS5zcHJpdGVzcGluKG9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZSgkKHNlbGVjdG9yKVswXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IEludGVyc2VjdGlvbk9ic2VydmVyIHNvIGJvb3QgaW5zdGFudGx5XG4gICAgICAgICQoc2VsZWN0b3IpLnNwcml0ZXNwaW4ob3B0aW9ucyk7XG4gICAgICAgIC8vICAgY29uc29sZS5sb2coXCJzcGlubmVyIGJvb3RlZCBieSBkZWZhdWx0XCIsIHNlbGVjdG9yLCBvcHRpb25zKTtcbiAgICB9XG59XG5cbmV4cG9ydCB7XG4gICAgY2FsbEltYWdlU3Bpbm5lcnMsXG59O1xuIiwiaW1wb3J0IHsgY3JlYXRlQWNjb3JkaW9ucyB9IGZyb20gJy4vYWNjb3JkaW9ucy9hY2NvcmRpb25zJztcblxuY29uc3QgY2FsbEFjY29yZGlvbnMgPSAoKSA9PiB7XG4gICAgY3JlYXRlQWNjb3JkaW9ucygpO1xufTtcblxuZXhwb3J0IHtcbiAgICBjYWxsQWNjb3JkaW9ucyxcbn07XG4iLCJpbXBvcnQgRFNNUEFjY29yZGlvbnMgZnJvbSAnLi4vLi4vbGlicmFyeS90YWJzLWFjY29yZGlvbnMvRFNNUEFjY29yZGlvbnMnO1xuXG5jb25zdCBhY2NvcmRpb25JRCA9ICdqcy1hY2MnO1xuY29uc3QgYWNjb3JkaW9uU2VsZWN0b3IgPSAnLmpzLWFjYy13cmFwcGVyJztcbmNvbnN0IGFjY29yZGlvbkl0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChhY2NvcmRpb25TZWxlY3Rvcik7XG5cbmNvbnN0IGNyZWF0ZUFjY29yZGlvbnMgPSAoKSA9PiB7XG4gICAgY29uc3QgYWNjb3JkaW9ucyA9IFtdO1xuXG4gICAgYWNjb3JkaW9uSXRlbXMuZm9yRWFjaCgoYWNjLCBpKSA9PiB7XG4gICAgICAgIGxldCBhY2NJRCA9IGAke2FjY29yZGlvbklEfS0ke2l9YDtcbiAgICAgICAgbGV0IGNhbGxJRCA9IGAjJHthY2NJRH1gO1xuICAgICAgICBhY2Muc2V0QXR0cmlidXRlKCdpZCcsIGFjY0lEKTtcblxuICAgICAgICBhY2NvcmRpb25zW2ldID0gbmV3IERTTVBBY2NvcmRpb25zKGNhbGxJRCk7XG5cbiAgICAgICAgLy9VbmNvbW1lbnQgaWYgYW4gZXZlbnQgaXMgbmVlZGVkIHRvIHJlIGluaXQgYWNjb3JkaW9ucywgZXg6IHdoZW4gdXNpbmcgbG9hZCBtb3JlIGZvciBmYXFzXG4gICAgICAgIC8vIGFjYy5hZGRFdmVudExpc3RlbmVyKCdyZS1pbml0JywgZXZlbnQgPT4ge1xuICAgICAgICAvLyAgICAgYWNjb3JkaW9uc1tpXS5yZUluaXQoKTtcbiAgICAgICAgLy8gfSlcbiAgICB9KTtcbn07XG5cbmV4cG9ydCB7XG4gICAgY3JlYXRlQWNjb3JkaW9ucyxcbn07XG4iLCJpbXBvcnQgeyBkc2Jsc1NsaWRlciB9IGZyb20gJy4vc2xpZGVycy9zbGlkZXItZHNibHMnO1xuaW1wb3J0IHsgc2ltcGxlU2xpZGVycyB9IGZyb20gJy4vc2xpZGVycy9zbGlkZXItc2ltcGxlJztcbmltcG9ydCB7IGFkdmFuY2VkU2xpZGVycyB9IGZyb20gJy4vc2xpZGVycy9zbGlkZXItYWR2YW5jZWQnO1xuaW1wb3J0IHsgY2lyY3VsYXJTbGlkZXJzIH0gZnJvbSAnLi9zbGlkZXJzL3NsaWRlci1jaXJjdWxhcic7XG5pbXBvcnQgeyBleHRlbmRlZFNsaWRlcnMgfSBmcm9tICcuL3NsaWRlcnMvc2xpZGVyLWV4dGVuZGVkJztcblxuY29uc3QgY2FsbFNsaWRlcnMgPSAoKSA9PiB7XG4gICAgZHNibHNTbGlkZXIoKTtcbiAgICBzaW1wbGVTbGlkZXJzKCk7XG4gICAgYWR2YW5jZWRTbGlkZXJzKCk7XG4gICAgY2lyY3VsYXJTbGlkZXJzKCk7XG4gICAgZXh0ZW5kZWRTbGlkZXJzKCk7XG59O1xuXG5leHBvcnQge1xuICAgIGNhbGxTbGlkZXJzLFxufTtcbiIsIi8qKlxuICogQWR2YW5jZWQgc2xpZGVyIHR5cGVcbiAqL1xuXG5pbXBvcnQgU3dpcGVyV2l0aFRhYnMgZnJvbSAnLi4vLi4vbGlicmFyeS9zbGlkZXJzL3N3aXBlci13aXRoLXRhYnMnO1xuaW1wb3J0IHsgaXNBdXRvUGxheU9uIH0gZnJvbSAnLi4vLi4vbGlicmFyeS9zbGlkZXJzL3NsaWRlci1vcHRpb25zL2F1dG9wbGF5JztcbmltcG9ydCB7IGlzTGF6eUxvYWRPbiB9IGZyb20gJy4uLy4uL2xpYnJhcnkvc2xpZGVycy9zbGlkZXItb3B0aW9ucy9sYXp5JztcbmltcG9ydCB7IGlzQnJlYWtwb2ludHNPbiB9IGZyb20gJy4uLy4uL2xpYnJhcnkvc2xpZGVycy9zbGlkZXItb3B0aW9ucy9icmVha3BvaW50cyc7XG5pbXBvcnQgeyBpc05hdmlnYXRpb25PbiB9IGZyb20gJy4uLy4uL2xpYnJhcnkvc2xpZGVycy9zbGlkZXItb3B0aW9ucy9uYXZpZ2F0aW9uJztcbmltcG9ydCB7IGlzTG9vcE9uIH0gZnJvbSAnLi4vLi4vbGlicmFyeS9zbGlkZXJzL3NsaWRlci1vcHRpb25zL2xvb3AnO1xuaW1wb3J0IHsgaXNQYWdpbmF0aW9uT24gfSBmcm9tICcuLi8uLi9saWJyYXJ5L3NsaWRlcnMvc2xpZGVyLW9wdGlvbnMvcGFnaW5hdGlvbic7XG5pbXBvcnQgeyB1X3BhcnNlQm9vbCB9IGZyb20gJy4uLy4uL3V0aWxzL3VfdHlwZXMnO1xuaW1wb3J0IHsgYXV0b3BsYXlPYnNlcnZlciB9IGZyb20gJy4uLy4uL2xpYnJhcnkvc2xpZGVycy9zbGlkZXItb3B0aW9ucy9hdXRvcGxheU9ic2VydmVyJztcbmltcG9ydCB7aXNFZmZlY3RPbn0gZnJvbSAnLi4vLi4vbGlicmFyeS9zbGlkZXJzL3NsaWRlci1vcHRpb25zL2VmZmVjdHMnO1xuXG4vLyBjb25maWcgc2VsZWN0b3JzIG9ubHkgaGVyZVxuY29uc3QgYWR2YW5jZWROYW1lID0gJ2pzLXNsaWRlci1hZHZhbmNlZCc7XG5jb25zdCBhZHZTbGlkZXJTZWwgPSAnLmpzLXNsaWRlci1hZHZhbmNlZCc7XG5jb25zdCBhZHZTbGlkZXJUYWJzID0gJy5sLXNsaWRlci1uYXYnO1xuXG4vLyBmaW5kIHRob3NlIHNlbGVjdG9yc1xuY29uc3QgYWR2U2xpZGVyTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYWR2U2xpZGVyU2VsKTtcblxuY29uc3QgYWR2YW5jZWRTbGlkZXJzID0gKCkgPT4ge1xuICAgIC8vIGxvb3AgdGhyb3VnaCBzbGlkZXJzIGFuZCBhZGQgSUQncyB0byBpdFxuXG4gICAgY29uc3QgYWR2U2xpZGVyT3B0aW9ucyA9IFtdO1xuICAgIGNvbnN0IGFkdlNsaWRlcnMgPSBbXTtcbiAgICBjb25zdCBzbGlkZXJUYWJPcHRpb25zID0gW107XG4gICAgY29uc3QgYWR2U2xpZGVyTmF2ID0gW107XG4gICAgbGV0IHNsaWRlck5hdjtcbiAgICBjb25zdCBhZHZTbGlkZXJUaHVtYnMgPSBbXTtcbiAgICBjb25zdCBzbGlkZXJUaHVtYk9wdGlvbnMgPSBbXTtcbiAgICBjb25zdCBhZHZhbmNlZE9ic2VydmVyID0gW107XG5cbiAgICBhZHZTbGlkZXJMaXN0LmZvckVhY2goKHNsaWRlciwgaSkgPT4ge1xuICAgICAgICBhZHZTbGlkZXJPcHRpb25zW2ldID0ge307XG5cbiAgICAgICAgY29uc3QgdHJpZ2dlclR5cGUgPSBzbGlkZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXNsaWRlci10cmlnZ2VyJykgfHwgJ2NsaWNrJztcblxuICAgICAgICBzbGlkZXJUYWJPcHRpb25zW2ldID0ge1xuICAgICAgICAgICAgaXRlbTogJy5qcy1uYXZfX2l0ZW0nLFxuICAgICAgICAgICAgYWN0aXZlOiAnaXMtYWN0aXZlJyxcbiAgICAgICAgICAgIHRyaWdnZXI6IHRyaWdnZXJUeXBlLFxuICAgICAgICB9O1xuXG4gICAgICAgIHNsaWRlclRodW1iT3B0aW9uc1tpXSA9IHtcbiAgICAgICAgICAgIHNwYWNlQmV0d2VlbjogMTAsXG4gICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAnYXV0bycsXG4gICAgICAgICAgICBmcmVlTW9kZTogdHJ1ZSxcbiAgICAgICAgICAgIHRocmVzaG9sZDogMTAsXG4gICAgICAgICAgICB3YXRjaFNsaWRlc1Byb2dyZXNzOiB0cnVlLFxuICAgICAgICAgICAgd3JhcHBlckNsYXNzOiAnYy1zbGlkZXItbmF2JyxcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBpc1RodW1icyA9IHVfcGFyc2VCb29sKHNsaWRlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2xpZGVyLXRodW1icycpKTtcblxuICAgICAgICBjb25zdCBzbGlkZXJJRCA9IGAke2FkdmFuY2VkTmFtZX0tJHtpfWA7XG4gICAgICAgIHNsaWRlci5zZXRBdHRyaWJ1dGUoJ2lkJywgc2xpZGVySUQpO1xuXG4gICAgICAgIGNvbnN0IHNsaWRlclBhcmVudCA9IHNsaWRlci5jbG9zZXN0KCcubS1zbGlkZXInKTtcblxuICAgICAgICBpZiAoc2xpZGVyUGFyZW50KSB7XG4gICAgICAgICAgICBzbGlkZXJOYXYgPSBzbGlkZXJQYXJlbnQucXVlcnlTZWxlY3RvcihhZHZTbGlkZXJUYWJzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzbGlkZXJUaHVtYnNTZWxlY3RvcjtcbiAgICAgICAgaWYgKHNsaWRlck5hdikge1xuICAgICAgICAgICAgaWYgKGlzVGh1bWJzKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2xpZGVyVGh1bWJzSUQgPSBganMtc2xpZGVyLWFkdmFuY2VkLXRodW1icy0ke2l9YDtcbiAgICAgICAgICAgICAgICBzbGlkZXJOYXYuc2V0QXR0cmlidXRlKCdpZCcsIHNsaWRlclRodW1ic0lEKTtcbiAgICAgICAgICAgICAgICBzbGlkZXJUaHVtYnNTZWxlY3RvciA9IGAjJHtzbGlkZXJUaHVtYnNJRH1gO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzbGlkZXJUYWJJRCA9IGBqcy1zbGlkZXItYWR2YW5jZWQtbmF2LSR7aX1gO1xuICAgICAgICAgICAgICAgIHNsaWRlck5hdi5zZXRBdHRyaWJ1dGUoJ2lkJywgc2xpZGVyVGFiSUQpO1xuICAgICAgICAgICAgICAgIHNsaWRlclRhYk9wdGlvbnNbaV0uZWxlbWVudCA9IGAjJHtzbGlkZXJUYWJJRH1gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYWR2U2xpZGVyT3B0aW9uc1tpXSA9IGlzTG9vcE9uKHNsaWRlciwgYWR2U2xpZGVyT3B0aW9uc1tpXSk7XG4gICAgICAgIGFkdlNsaWRlck9wdGlvbnNbaV0gPSBpc0F1dG9QbGF5T24oc2xpZGVyLCBhZHZTbGlkZXJPcHRpb25zW2ldKTtcbiAgICAgICAgYWR2U2xpZGVyT3B0aW9uc1tpXSA9IGlzTGF6eUxvYWRPbihzbGlkZXIsIGFkdlNsaWRlck9wdGlvbnNbaV0pO1xuICAgICAgICBhZHZTbGlkZXJPcHRpb25zW2ldID0gaXNCcmVha3BvaW50c09uKHNsaWRlciwgYWR2U2xpZGVyT3B0aW9uc1tpXSk7XG4gICAgICAgIGFkdlNsaWRlck9wdGlvbnNbaV0gPSBpc1BhZ2luYXRpb25PbihzbGlkZXIsIGFkdlNsaWRlck9wdGlvbnNbaV0pO1xuICAgICAgICBhZHZTbGlkZXJPcHRpb25zW2ldID0gaXNFZmZlY3RPbihzbGlkZXIsIGFkdlNsaWRlck9wdGlvbnNbaV0pO1xuXG4gICAgICAgIC8vIC5tLXNsaWRlciBwYXJlbnQgaXMgaGFyZGNvZGVkIGluIGlzTmF2aWdhdGlvbk9uIG9wdGlvbnNcbiAgICAgICAgYWR2U2xpZGVyT3B0aW9uc1tpXSA9IGlzTmF2aWdhdGlvbk9uKHNsaWRlciwgYWR2U2xpZGVyT3B0aW9uc1tpXSwgYWR2YW5jZWROYW1lLCBpKTtcblxuICAgICAgICBpZiAoaXNUaHVtYnMpIHtcblxuICAgICAgICAgICAgY29uc3QgaXNWZXJ0aWNhbCA9IHVfcGFyc2VCb29sKHNsaWRlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2xpZGVyLXZlcnRpY2FsJykpO1xuXG4gICAgICAgICAgICBpZiAoaXNWZXJ0aWNhbCkge1xuICAgICAgICAgICAgICAgIHNsaWRlclRodW1iT3B0aW9uc1tpXS5kaXJlY3Rpb24gPSAndmVydGljYWwnO1xuICAgICAgICAgICAgICAgIC8vIHNsaWRlclRodW1iT3B0aW9uc1tpXS5hdXRvSGVpZ2h0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzbGlkZXJQYXJlbnQuY2xhc3NMaXN0LmFkZCgnc3dpcGVyLXRodW1icy1uYXYtdmVydGljYWwnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYWR2U2xpZGVyVGh1bWJzW2ldID0gbmV3IFN3aXBlcihzbGlkZXJUaHVtYnNTZWxlY3Rvciwgc2xpZGVyVGh1bWJPcHRpb25zW2ldKTtcblxuICAgICAgICAgICAgYWR2U2xpZGVyT3B0aW9uc1tpXS50aHVtYnMgPSB7fTtcbiAgICAgICAgICAgIGFkdlNsaWRlck9wdGlvbnNbaV0udGh1bWJzLnN3aXBlciA9IGFkdlNsaWRlclRodW1ic1tpXTtcblxuICAgICAgICAgICAgYWR2U2xpZGVyT3B0aW9uc1tpXS5ub1N3aXBpbmdTZWxlY3RvciA9ICcubC1zbGlkZXItbmF2LCAubS1zbGlkZXJfX3BhZ2luYXRpb24nO1xuXG4gICAgICAgIH1cblxuICAgICAgICBhZHZTbGlkZXJzW2ldID0gbmV3IFN3aXBlcihzbGlkZXIsIGFkdlNsaWRlck9wdGlvbnNbaV0pO1xuXG4gICAgICAgIGlmIChzbGlkZXJOYXYpIHtcbiAgICAgICAgICAgIGlmIChhZHZTbGlkZXJzW2ldLmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICAgICAgYWR2U2xpZGVyTmF2W2ldID0gbmV3IFN3aXBlcldpdGhUYWJzKGFkdlNsaWRlcnNbaV0sIHNsaWRlclRhYk9wdGlvbnNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNBdXRvcGxheSA9IHNsaWRlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2xpZGVyLWF1dG9wbGF5Jyk7XG4gICAgICAgIGNvbnN0IGF1dG9wbGF5T2JzZXJ2ZSA9IHVfcGFyc2VCb29sKHNsaWRlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2xpZGVyLWF1dG9wbGF5LW9ic2VydmVyJykpO1xuXG4gICAgICAgIGlmIChpc0F1dG9wbGF5ICYmIGF1dG9wbGF5T2JzZXJ2ZSkge1xuICAgICAgICAgICAgYWR2U2xpZGVyc1tpXS5hdXRvcGxheS5zdG9wKCk7XG4gICAgICAgICAgICBhZHZhbmNlZE9ic2VydmVyLnB1c2goe1xuICAgICAgICAgICAgICAgIHNsaWRlcjogc2xpZGVySUQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGFkdmFuY2VkT2JzZXJ2ZXIubGVuZ3RoID4gMCkge1xuICAgICAgICBhdXRvcGxheU9ic2VydmVyKGFkdmFuY2VkT2JzZXJ2ZXIsIGFkdmFuY2VkTmFtZSwgYWR2U2xpZGVycyk7XG4gICAgfVxufTtcblxuZXhwb3J0IHtcbiAgICBhZHZhbmNlZFNsaWRlcnMsXG59O1xuIiwiLyoqXG4gKiBBZHZhbmNlZCBzbGlkZXIgdHlwZVxuICovXG5cbmltcG9ydCB7IGlzQXV0b1BsYXlPbiB9IGZyb20gJy4uLy4uL2xpYnJhcnkvc2xpZGVycy9zbGlkZXItb3B0aW9ucy9hdXRvcGxheSc7XG5pbXBvcnQgeyBpc0xhenlMb2FkT24gfSBmcm9tICcuLi8uLi9saWJyYXJ5L3NsaWRlcnMvc2xpZGVyLW9wdGlvbnMvbGF6eSc7XG5pbXBvcnQgeyBpc0JyZWFrcG9pbnRzT24gfSBmcm9tICcuLi8uLi9saWJyYXJ5L3NsaWRlcnMvc2xpZGVyLW9wdGlvbnMvYnJlYWtwb2ludHMnO1xuaW1wb3J0IHsgaXNOYXZpZ2F0aW9uT24gfSBmcm9tICcuLi8uLi9saWJyYXJ5L3NsaWRlcnMvc2xpZGVyLW9wdGlvbnMvbmF2aWdhdGlvbic7XG5cbmltcG9ydCB7IGlzTG9vcE9uIH0gZnJvbSAnLi4vLi4vbGlicmFyeS9zbGlkZXJzL3NsaWRlci1vcHRpb25zL2xvb3AnO1xuaW1wb3J0IHsgaXNFZmZlY3RPbiB9IGZyb20gJy4uLy4uL2xpYnJhcnkvc2xpZGVycy9zbGlkZXItb3B0aW9ucy9lZmZlY3RzJztcbmltcG9ydCBTd2lwZXJXaXRoQ2lyY3VsYXJUYWJzIGZyb20gJy4uLy4uL2xpYnJhcnkvc2xpZGVycy9zd2lwZXItd2l0aC1jaXJjdWxhci10YWJzJztcbmltcG9ydCB7IGlzUGFnaW5hdGlvbk9uIH0gZnJvbSAnLi4vLi4vbGlicmFyeS9zbGlkZXJzL3NsaWRlci1vcHRpb25zL3BhZ2luYXRpb24nO1xuaW1wb3J0IHsgdV9wYXJzZUJvb2wgfSBmcm9tICcuLi8uLi91dGlscy91X3R5cGVzJztcblxuLy8gY29uZmlnIHNlbGVjdG9ycyBvbmx5IGhlcmVcbmNvbnN0IGFkdmFuY2VkTmFtZSA9ICdqcy1jaXJjdWxhci1hZHYnO1xuY29uc3QgYWR2U2xpZGVyU2VsID0gJy5qcy1jaXJjdWxhci1hZHYnO1xuY29uc3QgYWR2U2xpZGVyVGFicyA9ICcubC1zbGlkZXItbmF2JztcblxuLy8gZmluZCB0aG9zZSBzZWxlY3RvcnNcbmNvbnN0IGFkdlNsaWRlckxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGFkdlNsaWRlclNlbCk7XG5cbmNvbnN0IGNpcmN1bGFyU2xpZGVycyA9ICgpID0+IHtcbiAgICAvLyBsb29wIHRocm91Z2ggc2xpZGVycyBhbmQgYWRkIElEJ3MgdG8gaXRcblxuICAgIGNvbnN0IGFkdlNsaWRlck9wdGlvbnMgPSBbXTtcbiAgICBjb25zdCBhZHZTbGlkZXJzID0gW107XG4gICAgY29uc3Qgc2xpZGVyVGFiT3B0aW9ucyA9IFtdO1xuICAgIGNvbnN0IGFkdlNsaWRlck5hdiA9IFtdO1xuICAgIGxldCBzbGlkZXJOYXY7XG4gICAgY29uc3Qgc2xpZGVyVGh1bWJPcHRpb25zID0gW107XG5cbiAgICBhZHZTbGlkZXJMaXN0LmZvckVhY2goIChzbGlkZXIsIGkpID0+IHtcbiAgICAgICAgYWR2U2xpZGVyT3B0aW9uc1tpXSA9IHt9O1xuICAgICAgICBzbGlkZXJUYWJPcHRpb25zW2ldID0ge1xuICAgICAgICAgICAgaXRlbTogJy5qcy1uYXZfX2l0ZW0nLFxuICAgICAgICB9O1xuXG4gICAgICAgIHNsaWRlclRodW1iT3B0aW9uc1tpXSA9IHtcbiAgICAgICAgICAgIHNwYWNlQmV0d2VlbjogMTAsXG4gICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAnYXV0bycsXG4gICAgICAgICAgICBmcmVlTW9kZTogdHJ1ZSxcbiAgICAgICAgICAgIHRocmVzaG9sZDogMTAsXG4gICAgICAgICAgICB3YXRjaFNsaWRlc1Byb2dyZXNzOiB0cnVlLFxuICAgICAgICAgICAgd3JhcHBlckNsYXNzOiAnYy1zbGlkZXItbmF2JyxcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHNsaWRlcklEID0gYCR7YWR2YW5jZWROYW1lfS0ke2l9YDtcbiAgICAgICAgc2xpZGVyLnNldEF0dHJpYnV0ZSgnaWQnLCBzbGlkZXJJRCk7XG5cbiAgICAgICAgY29uc3Qgc2xpZGVyUGFyZW50ID0gc2xpZGVyLmNsb3Nlc3QoJy5tLXNsaWRlcicpO1xuXG4gICAgICAgIGlmIChzbGlkZXJQYXJlbnQpIHtcbiAgICAgICAgICAgIHNsaWRlck5hdiA9IHNsaWRlclBhcmVudC5xdWVyeVNlbGVjdG9yKGFkdlNsaWRlclRhYnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNsaWRlck5hdikge1xuICAgICAgICAgICAgY29uc3Qgc2xpZGVyVGFiSUQgPSBganMtc2xpZGVyLWNpcmN1bGFyLW5hdi0ke2l9YDtcbiAgICAgICAgICAgIHNsaWRlck5hdi5zZXRBdHRyaWJ1dGUoJ2lkJywgc2xpZGVyVGFiSUQpO1xuICAgICAgICAgICAgc2xpZGVyVGFiT3B0aW9uc1tpXS5lbGVtZW50ID0gYCMke3NsaWRlclRhYklEfWA7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpc0NlbnRlclNsaWRlcyA9IHNsaWRlck5hdi5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2xpZGVyLWNpcmN1bGFyLWFycmFuZ2UnKTtcbiAgICAgICAgY29uc3QgaXNTeW1tZXRyaWMgPSB1X3BhcnNlQm9vbChzbGlkZXJOYXYuZ2V0QXR0cmlidXRlKCdkYXRhLXNsaWRlci1jaXJjdWxhci1zeW1tZXRyaWMnKSkgfHwgZmFsc2U7XG5cbiAgICAgICAgaWYgKGlzQ2VudGVyU2xpZGVzID09PSAnY2VudGVyJyAmJiAhaXNTeW1tZXRyaWMpIHtcbiAgICAgICAgICAgIGNvbnN0IGNTbGlkZXJOYXYgPSBzbGlkZXJOYXYucXVlcnlTZWxlY3RvcignLmMtc2xpZGVyLW5hdicpO1xuICAgICAgICAgICAgaWYgKGNTbGlkZXJOYXYpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbml0aWFsSW5kZXggPSBwYXJzZUludChjU2xpZGVyTmF2LmdldEF0dHJpYnV0ZSgnZGF0YS1pbml0aWFsLWluZGV4JyksIDEwKTtcbiAgICAgICAgICAgICAgICBzbGlkZXJOYXYuc3R5bGUuc2V0UHJvcGVydHkoJy0tY0FJdGVtJywgaW5pdGlhbEluZGV4KTtcbiAgICAgICAgICAgICAgICBhZHZTbGlkZXJPcHRpb25zW2ldLmluaXRpYWxTbGlkZSA9IGluaXRpYWxJbmRleDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNsaWRlck5hdi5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1jQUl0ZW0nLCAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFkdlNsaWRlck9wdGlvbnNbaV0gPSBpc0xvb3BPbihzbGlkZXIsIGFkdlNsaWRlck9wdGlvbnNbaV0pO1xuICAgICAgICBhZHZTbGlkZXJPcHRpb25zW2ldID0gaXNBdXRvUGxheU9uKHNsaWRlciwgYWR2U2xpZGVyT3B0aW9uc1tpXSk7XG4gICAgICAgIGFkdlNsaWRlck9wdGlvbnNbaV0gPSBpc0xhenlMb2FkT24oc2xpZGVyLCBhZHZTbGlkZXJPcHRpb25zW2ldKTtcbiAgICAgICAgYWR2U2xpZGVyT3B0aW9uc1tpXSA9IGlzQnJlYWtwb2ludHNPbihzbGlkZXIsIGFkdlNsaWRlck9wdGlvbnNbaV0pO1xuICAgICAgICBhZHZTbGlkZXJPcHRpb25zW2ldID0gaXNFZmZlY3RPbihzbGlkZXIsIGFkdlNsaWRlck9wdGlvbnNbaV0pO1xuICAgICAgICBhZHZTbGlkZXJPcHRpb25zW2ldID0gaXNQYWdpbmF0aW9uT24oc2xpZGVyLCBhZHZTbGlkZXJPcHRpb25zW2ldKTtcblxuICAgICAgICAvLyAubS1zbGlkZXIgcGFyZW50IGlzIGhhcmRjb2RlZCBpbiBpc05hdmlnYXRpb25PbiBvcHRpb25zXG4gICAgICAgIGFkdlNsaWRlck9wdGlvbnNbaV0gPSBpc05hdmlnYXRpb25PbihzbGlkZXIsIGFkdlNsaWRlck9wdGlvbnNbaV0sIGFkdmFuY2VkTmFtZSwgaSk7XG4gICAgICAgIFxuICAgICAgICBhZHZTbGlkZXJzW2ldID0gbmV3IFN3aXBlcihzbGlkZXIsIGFkdlNsaWRlck9wdGlvbnNbaV0pO1xuXG4gICAgICAgIGlmIChzbGlkZXJOYXYpIHtcbiAgICAgICAgICAgIGlmIChhZHZTbGlkZXJzW2ldLmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICAgICAgYWR2U2xpZGVyTmF2W2ldID0gbmV3IFN3aXBlcldpdGhDaXJjdWxhclRhYnMoYWR2U2xpZGVyc1tpXSwgc2xpZGVyVGFiT3B0aW9uc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbmV4cG9ydCB7XG4gICAgY2lyY3VsYXJTbGlkZXJzLFxufTtcbiIsIi8qKlxuICogRFNCTFMgU0xJREVSIHR5cGVcbiAqL1xuaW1wb3J0IERTTVBTbGlkZXJEU0JMUyBmcm9tICcuLi8uLi9saWJyYXJ5L3NsaWRlcnMvc2xpZGVyLWRzYmxzJztcblxuLy8gY29uZmlnIHNlbGVjdG9ycyBvbmx5IGhlcmVcbmNvbnN0IGRzYmxzU2VsID0gJy5qcy1zbGlkZXItZHNibHMnO1xuY29uc3QgZHNibHNTZWxNb2IgPSAnLmpzLXNsaWRlci1kc2Jscy1tJztcblxuLy8gZmluZCB0aG9zZSBzZWxlY3RvcnNcbmNvbnN0IGRzYmxzU2xpZGVyTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZHNibHNTZWwpO1xuY29uc3QgZHNibHNTbGlkZXJNb2JpbGVMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChkc2Jsc1NlbE1vYik7XG5cbmNvbnN0IGRzYmxzU2xpZGVyID0gKCkgPT4ge1xuICAgIC8vIGxvb3AgdGhyb3VnaCBzbGlkZXJzIGFuZCBhZGQgSUQncyB0byBpdCwgd2UgYXNzdW1lIGVhY2ggXG4gICAgLy8gZHNibHMgc2xpZGVyIGhhcyBpdHMgb3duIG1vYmlsZSBzbGlkZXIgYXMgaXRzXG4gICAgLy8gY29tcG9uZW50LCBzbyBubyBuZWVkIHRvIGxvb3AsIHNlYXJjaCBwYXJlbnQgXG4gICAgLy8gYW5kIHF1ZXJ5IGNoaWxkIGVsZW1lbnRcblxuICAgIGNvbnN0IGRzYmxzID0gW107XG4gICAgZHNibHNTbGlkZXJMaXN0LmZvckVhY2goIChzbGlkZXIsIGkpID0+IHtcbiAgICAgICAgY29uc3Qgc2xpZGVySUQgPSBganMtc2xpZGVyLWRzYmxzLSR7aX1gO1xuICAgICAgICBjb25zdCBzbGlkZXJNb2JpbGVJRCA9IGBqcy1zbGlkZXItZHNibHMtbS0ke2l9YDtcblxuICAgICAgICBzbGlkZXIuc2V0QXR0cmlidXRlKCdpZCcsIHNsaWRlcklEKTtcbiAgICAgICAgZHNibHNTbGlkZXJNb2JpbGVMaXN0W2ldLnNldEF0dHJpYnV0ZSgnaWQnLCBzbGlkZXJNb2JpbGVJRCk7XG5cbiAgICAgICAgZHNibHNbaV0gPSBuZXcgRFNNUFNsaWRlckRTQkxTKHNsaWRlcklEKTtcbiAgICB9KTtcbn07XG5cbmV4cG9ydCB7XG4gICAgZHNibHNTbGlkZXIsXG59XG4iLCIvKipcbiAqIEFkdmFuY2VkIHNsaWRlciB0eXBlXG4gKi9cblxuaW1wb3J0IFN3aXBlcldpdGhUYWJzIGZyb20gJy4uLy4uL2xpYnJhcnkvc2xpZGVycy9zd2lwZXItd2l0aC10YWJzJztcbmltcG9ydCB7IGlzQXV0b1BsYXlPbiB9IGZyb20gJy4uLy4uL2xpYnJhcnkvc2xpZGVycy9zbGlkZXItb3B0aW9ucy9hdXRvcGxheSc7XG5pbXBvcnQgeyBpc0xhenlMb2FkT24gfSBmcm9tICcuLi8uLi9saWJyYXJ5L3NsaWRlcnMvc2xpZGVyLW9wdGlvbnMvbGF6eSc7XG5pbXBvcnQgeyBpc0JyZWFrcG9pbnRzT24gfSBmcm9tICcuLi8uLi9saWJyYXJ5L3NsaWRlcnMvc2xpZGVyLW9wdGlvbnMvYnJlYWtwb2ludHMnO1xuaW1wb3J0IHsgaXNOYXZpZ2F0aW9uT24gfSBmcm9tICcuLi8uLi9saWJyYXJ5L3NsaWRlcnMvc2xpZGVyLW9wdGlvbnMvbmF2aWdhdGlvbic7XG5pbXBvcnQgeyBpc0xvb3BPbiB9IGZyb20gJy4uLy4uL2xpYnJhcnkvc2xpZGVycy9zbGlkZXItb3B0aW9ucy9sb29wJztcbmltcG9ydCB7IGlzUGFnaW5hdGlvbk9uIH0gZnJvbSAnLi4vLi4vbGlicmFyeS9zbGlkZXJzL3NsaWRlci1vcHRpb25zL3BhZ2luYXRpb24nO1xuaW1wb3J0IHsgdV9wYXJzZUJvb2wgfSBmcm9tICcuLi8uLi91dGlscy91X3R5cGVzJztcbmltcG9ydCB7IGF1dG9wbGF5T2JzZXJ2ZXIgfSBmcm9tICcuLi8uLi9saWJyYXJ5L3NsaWRlcnMvc2xpZGVyLW9wdGlvbnMvYXV0b3BsYXlPYnNlcnZlcic7XG5pbXBvcnQge2lzRWZmZWN0T259IGZyb20gJy4uLy4uL2xpYnJhcnkvc2xpZGVycy9zbGlkZXItb3B0aW9ucy9lZmZlY3RzJztcblxuLy8gY29uZmlnIHNlbGVjdG9ycyBvbmx5IGhlcmVcbmNvbnN0IGFkdmFuY2VkTmFtZSA9ICdqcy1zbGlkZXItZXh0ZW5kZWQnO1xuY29uc3QgYWR2U2xpZGVyU2VsID0gJy5qcy1zbGlkZXItZXh0ZW5kZWQnO1xuY29uc3QgYWR2U2xpZGVyVGFicyA9ICcubC1zbGlkZXItbmF2JztcbmNvbnN0IGFkdlNsaWRlckNvbnRlbnQgPSAnLmwtc2xpZGVyLWNvbnRlbnQnO1xuXG4vLyBmaW5kIHRob3NlIHNlbGVjdG9yc1xuY29uc3QgYWR2U2xpZGVyTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYWR2U2xpZGVyU2VsKTtcblxuY29uc3QgZXh0ZW5kZWRTbGlkZXJzID0gKCkgPT4ge1xuICAgIC8vIGxvb3AgdGhyb3VnaCBzbGlkZXJzIGFuZCBhZGQgSUQncyB0byBpdFxuXG4gICAgY29uc3QgYWR2U2xpZGVyT3B0aW9ucyA9IFtdO1xuICAgIGNvbnN0IGFkdlNsaWRlcnMgPSBbXTtcbiAgICBjb25zdCBzbGlkZXJUYWJPcHRpb25zID0gW107XG4gICAgY29uc3QgYWR2U2xpZGVyTmF2ID0gW107XG4gICAgbGV0IHNsaWRlck5hdjtcbiAgICBjb25zdCBhZHZTbGlkZXJUaHVtYnMgPSBbXTtcbiAgICBjb25zdCBzbGlkZXJUaHVtYk9wdGlvbnMgPSBbXTtcbiAgICBjb25zdCBhZHZhbmNlZE9ic2VydmVyID0gW107XG4gICAgY29uc3QgYWR2Q29udGVudE9wdGlvbnMgPSBbXTtcbiAgICBjb25zdCBhZHZTbGlkZXJzQ29udGVudCA9IFtdO1xuICAgIGNvbnN0IGFSZXEgPSBbXTtcblxuICAgIGFkdlNsaWRlckxpc3QuZm9yRWFjaCgoc2xpZGVyLCBpKSA9PiB7XG4gICAgICAgIGFkdlNsaWRlck9wdGlvbnNbaV0gPSB7fTtcblxuICAgICAgICBjb25zdCB0cmlnZ2VyVHlwZSA9IHNsaWRlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2xpZGVyLXRyaWdnZXInKSB8fCAnY2xpY2snO1xuXG4gICAgICAgIHNsaWRlclRhYk9wdGlvbnNbaV0gPSB7XG4gICAgICAgICAgICBpdGVtOiAnLmpzLW5hdl9faXRlbScsXG4gICAgICAgICAgICBhY3RpdmU6ICdpcy1hY3RpdmUnLFxuICAgICAgICAgICAgdHJpZ2dlcjogdHJpZ2dlclR5cGUsXG4gICAgICAgIH07XG5cbiAgICAgICAgc2xpZGVyVGh1bWJPcHRpb25zW2ldID0ge1xuICAgICAgICAgICAgc3BhY2VCZXR3ZWVuOiAxMCxcbiAgICAgICAgICAgIHNsaWRlc1BlclZpZXc6ICdhdXRvJyxcbiAgICAgICAgICAgIGZyZWVNb2RlOiB0cnVlLFxuICAgICAgICAgICAgdGhyZXNob2xkOiAxMCxcbiAgICAgICAgICAgIHdhdGNoU2xpZGVzUHJvZ3Jlc3M6IHRydWUsXG4gICAgICAgICAgICB3cmFwcGVyQ2xhc3M6ICdjLXNsaWRlci1uYXYnLFxuICAgICAgICB9O1xuXG4gICAgICAgIGFkdkNvbnRlbnRPcHRpb25zW2ldID0ge1xuICAgICAgICAgICAgd3JhcHBlckNsYXNzOiAnbC1zbGlkZXItY29udGVudF9fd3JhcHBlcicsXG4gICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiAxLFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGlzVGh1bWJzID0gdV9wYXJzZUJvb2woc2xpZGVyLmdldEF0dHJpYnV0ZSgnZGF0YS1zbGlkZXItdGh1bWJzJykpO1xuXG4gICAgICAgIGNvbnN0IHNsaWRlcklEID0gYCR7YWR2YW5jZWROYW1lfS0ke2l9YDtcbiAgICAgICAgc2xpZGVyLnNldEF0dHJpYnV0ZSgnaWQnLCBzbGlkZXJJRCk7XG5cbiAgICAgICAgY29uc3Qgc2xpZGVyUGFyZW50ID0gc2xpZGVyLmNsb3Nlc3QoJy5tLXNsaWRlcicpO1xuXG4gICAgICAgIGlmIChzbGlkZXJQYXJlbnQpIHtcbiAgICAgICAgICAgIHNsaWRlck5hdiA9IHNsaWRlclBhcmVudC5xdWVyeVNlbGVjdG9yKGFkdlNsaWRlclRhYnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNsaWRlclRodW1ic1NlbGVjdG9yO1xuICAgICAgICBpZiAoc2xpZGVyTmF2KSB7XG4gICAgICAgICAgICBpZiAoaXNUaHVtYnMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzbGlkZXJUaHVtYnNJRCA9IGBqcy1zbGlkZXItZXh0ZW5kZWQtdGh1bWJzLSR7aX1gO1xuICAgICAgICAgICAgICAgIHNsaWRlck5hdi5zZXRBdHRyaWJ1dGUoJ2lkJywgc2xpZGVyVGh1bWJzSUQpO1xuICAgICAgICAgICAgICAgIHNsaWRlclRodW1ic1NlbGVjdG9yID0gYCMke3NsaWRlclRodW1ic0lEfWA7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNsaWRlclRhYklEID0gYGpzLXNsaWRlci1leHRlbmRlZC1uYXYtJHtpfWA7XG4gICAgICAgICAgICAgICAgc2xpZGVyTmF2LnNldEF0dHJpYnV0ZSgnaWQnLCBzbGlkZXJUYWJJRCk7XG4gICAgICAgICAgICAgICAgc2xpZGVyVGFiT3B0aW9uc1tpXS5lbGVtZW50ID0gYCMke3NsaWRlclRhYklEfWA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2xpZGVyQ29udGVudCA9IHNsaWRlclBhcmVudC5xdWVyeVNlbGVjdG9yKGFkdlNsaWRlckNvbnRlbnQpO1xuXG4gICAgICAgIGNvbnN0IHNsaWRlckNvbnRlbnRJRCA9IGBqcy1zbGlkZXItZXh0ZW5kZWQtY29udGVudC0ke2l9YDtcbiAgICAgICAgc2xpZGVyQ29udGVudC5zZXRBdHRyaWJ1dGUoJ2lkJywgc2xpZGVyQ29udGVudElEKTtcbiAgICAgICAgbGV0IHNsaWRlckNvbnRlbnRTZWxlY3RvciA9IGAjJHtzbGlkZXJDb250ZW50SUR9YDtcblxuICAgICAgICBhZHZTbGlkZXJPcHRpb25zW2ldID0gaXNMb29wT24oc2xpZGVyLCBhZHZTbGlkZXJPcHRpb25zW2ldKTtcbiAgICAgICAgYWR2U2xpZGVyT3B0aW9uc1tpXSA9IGlzQXV0b1BsYXlPbihzbGlkZXIsIGFkdlNsaWRlck9wdGlvbnNbaV0pO1xuICAgICAgICBhZHZTbGlkZXJPcHRpb25zW2ldID0gaXNMYXp5TG9hZE9uKHNsaWRlciwgYWR2U2xpZGVyT3B0aW9uc1tpXSk7XG4gICAgICAgIGFkdlNsaWRlck9wdGlvbnNbaV0gPSBpc0JyZWFrcG9pbnRzT24oc2xpZGVyLCBhZHZTbGlkZXJPcHRpb25zW2ldKTtcbiAgICAgICAgYWR2U2xpZGVyT3B0aW9uc1tpXSA9IGlzUGFnaW5hdGlvbk9uKHNsaWRlciwgYWR2U2xpZGVyT3B0aW9uc1tpXSk7XG4gICAgICAgIGFkdlNsaWRlck9wdGlvbnNbaV0gPSBpc0VmZmVjdE9uKHNsaWRlciwgYWR2U2xpZGVyT3B0aW9uc1tpXSk7XG5cbiAgICAgICAgLy8gLm0tc2xpZGVyIHBhcmVudCBpcyBoYXJkY29kZWQgaW4gaXNOYXZpZ2F0aW9uT24gb3B0aW9uc1xuICAgICAgICBhZHZTbGlkZXJPcHRpb25zW2ldID0gaXNOYXZpZ2F0aW9uT24oc2xpZGVyLCBhZHZTbGlkZXJPcHRpb25zW2ldLCBhZHZhbmNlZE5hbWUsIGkpO1xuXG4gICAgICAgIGlmIChpc1RodW1icykge1xuXG4gICAgICAgICAgICBjb25zdCBpc1ZlcnRpY2FsID0gdV9wYXJzZUJvb2woc2xpZGVyLmdldEF0dHJpYnV0ZSgnZGF0YS1zbGlkZXItdmVydGljYWwnKSk7XG5cbiAgICAgICAgICAgIGlmIChpc1ZlcnRpY2FsKSB7XG4gICAgICAgICAgICAgICAgc2xpZGVyVGh1bWJPcHRpb25zW2ldLmRpcmVjdGlvbiA9ICd2ZXJ0aWNhbCc7XG4gICAgICAgICAgICAgICAgLy8gc2xpZGVyVGh1bWJPcHRpb25zW2ldLmF1dG9IZWlnaHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNsaWRlclBhcmVudC5jbGFzc0xpc3QuYWRkKCdzd2lwZXItdGh1bWJzLW5hdi12ZXJ0aWNhbCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhZHZTbGlkZXJUaHVtYnNbaV0gPSBuZXcgU3dpcGVyKHNsaWRlclRodW1ic1NlbGVjdG9yLCBzbGlkZXJUaHVtYk9wdGlvbnNbaV0pO1xuXG4gICAgICAgICAgICBhZHZTbGlkZXJPcHRpb25zW2ldLnRodW1icyA9IHt9O1xuICAgICAgICAgICAgYWR2U2xpZGVyT3B0aW9uc1tpXS50aHVtYnMuc3dpcGVyID0gYWR2U2xpZGVyVGh1bWJzW2ldO1xuXG4gICAgICAgICAgICBhZHZTbGlkZXJPcHRpb25zW2ldLm5vU3dpcGluZ1NlbGVjdG9yID0gJy5sLXNsaWRlci1uYXYsIC5tLXNsaWRlcl9fcGFnaW5hdGlvbic7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGFkdlNsaWRlck9wdGlvbnNbaV0ub24gPSB7fTtcblxuICAgICAgICBhZHZTbGlkZXJzW2ldID0gbmV3IFN3aXBlcihzbGlkZXIsIGFkdlNsaWRlck9wdGlvbnNbaV0pO1xuXG4gICAgICAgIGFkdlNsaWRlcnNDb250ZW50W2ldID0gbmV3IFN3aXBlcihzbGlkZXJDb250ZW50U2VsZWN0b3IsIGFkdkNvbnRlbnRPcHRpb25zW2ldKTtcblxuICAgICAgICBhZHZTbGlkZXJzQ29udGVudFtpXS5jb250cm9sbGVyLmNvbnRyb2wgPSBhZHZTbGlkZXJzW2ldO1xuICAgICAgICBhZHZTbGlkZXJzW2ldLmNvbnRyb2xsZXIuY29udHJvbCA9IGFkdlNsaWRlcnNDb250ZW50W2ldO1xuXG4gICAgICAgIGlmIChzbGlkZXJOYXYpIHtcbiAgICAgICAgICAgIGlmIChhZHZTbGlkZXJzW2ldLmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICAgICAgYWR2U2xpZGVyTmF2W2ldID0gbmV3IFN3aXBlcldpdGhUYWJzKGFkdlNsaWRlcnNbaV0sIHNsaWRlclRhYk9wdGlvbnNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNBdXRvcGxheSA9IHNsaWRlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2xpZGVyLWF1dG9wbGF5Jyk7XG4gICAgICAgIGNvbnN0IGF1dG9wbGF5T2JzZXJ2ZSA9IHVfcGFyc2VCb29sKHNsaWRlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2xpZGVyLWF1dG9wbGF5LW9ic2VydmVyJykpO1xuXG4gICAgICAgIGlmIChpc0F1dG9wbGF5ICYmIGF1dG9wbGF5T2JzZXJ2ZSkge1xuICAgICAgICAgICAgYWR2U2xpZGVyc1tpXS5hdXRvcGxheS5zdG9wKCk7XG4gICAgICAgICAgICBhZHZhbmNlZE9ic2VydmVyLnB1c2goe1xuICAgICAgICAgICAgICAgIHNsaWRlcjogc2xpZGVySUQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHNsaWRlclByb2dyZXNzID0gc2xpZGVyUGFyZW50LnF1ZXJ5U2VsZWN0b3IoJy5jLXNsaWRlci1wcm9ncmVzcy1maWxsJyk7XG4gICAgICAgIGlmIChzbGlkZXJQcm9ncmVzcyAmJiBpc0F1dG9wbGF5KSB7XG4gICAgICAgICAgICBhUmVxW2ldID0gbnVsbDtcblxuICAgICAgICAgICAgYWR2U2xpZGVyc1tpXS5vbigncmVhbEluZGV4Q2hhbmdlJywgKHMpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBkdXJhdGlvbiA9IHMucGFyYW1zLmF1dG9wbGF5LmRlbGF5O1xuICAgICAgICAgICAgICAgIGFuaW1hdGVQcm9ncmVzcyhkdXJhdGlvbiwgc2xpZGVyUHJvZ3Jlc3MsIGkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGFkdlNsaWRlcnNbaV0ub24oJ3NsaWRlckZpcnN0TW92ZScsIChzKSA9PiB7XG4gICAgICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoYVJlcVtpXSk7XG4gICAgICAgICAgICAgICAgLy8gc2xpZGVyUHJvZ3Jlc3Muc3R5bGUuc2V0UHJvcGVydHkoJy0tYWEnLCAnMCcpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGFkdlNsaWRlcnNbaV0ub24oJ2F1dG9wbGF5U3RvcCcsIChzKSA9PiB7XG4gICAgICAgICAgICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoYVJlcVtpXSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYWR2U2xpZGVyc1tpXS5vbignYXV0b3BsYXlTdGFydCcsIChzKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZHVyYXRpb24gPSBzLnBhcmFtcy5hdXRvcGxheS5kZWxheTtcbiAgICAgICAgICAgICAgICBhbmltYXRlUHJvZ3Jlc3MoZHVyYXRpb24sIHNsaWRlclByb2dyZXNzLCBpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBhZHZTbGlkZXJzW2ldLm9uKCdzbGlkZVJlc2V0VHJhbnNpdGlvbkVuZCcsIChzKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgZHVyYXRpb24gPSBzLnBhcmFtcy5hdXRvcGxheS5kZWxheTtcbiAgICAgICAgICAgICAgICBhbmltYXRlUHJvZ3Jlc3MoZHVyYXRpb24sIHNsaWRlclByb2dyZXNzLCBpKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoYWR2YW5jZWRPYnNlcnZlci5sZW5ndGggPiAwKSB7XG4gICAgICAgIGF1dG9wbGF5T2JzZXJ2ZXIoYWR2YW5jZWRPYnNlcnZlciwgYWR2YW5jZWROYW1lLCBhZHZTbGlkZXJzKTtcbiAgICB9XG5cbiAgICBjb25zdCBhbmltYXRlUHJvZ3Jlc3MgPSAoZHVyYXRpb24sIGVsLCBpKSA9PiB7XG4gICAgICAgIGxldCBzdGFydDtcbiAgICAgICAgbGV0IHByZXZpb3VzVGltZVN0YW1wO1xuICAgICAgICBsZXQgZG9uZSA9IGZhbHNlO1xuICAgICAgICBlbC5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1maWxsUHJvZ3Jlc3MnLCAwKTtcblxuICAgICAgICBjb25zdCBzdGVwID0gKHRpbWVzdGFtcCkgPT4ge1xuICAgICAgICAgICAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBzdGFydCA9IHRpbWVzdGFtcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGVsYXBzZWQgPSB0aW1lc3RhbXAgLSBzdGFydDtcblxuICAgICAgICAgICAgaWYgKHByZXZpb3VzVGltZVN0YW1wICE9PSB0aW1lc3RhbXApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9nID0gTWF0aC5taW4oZWxhcHNlZCAvIGR1cmF0aW9uLCAxKTtcbiAgICAgICAgICAgICAgICBlbC5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1maWxsUHJvZ3Jlc3MnLCBgJHtwcm9nfWApO1xuICAgICAgICAgICAgICAgIGlmIChwcm9nID09PSAxKSBkb25lID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGVsYXBzZWQgPCBkdXJhdGlvbikge1xuICAgICAgICAgICAgICAgIHByZXZpb3VzVGltZVN0YW1wID0gdGltZXN0YW1wO1xuICAgICAgICAgICAgICAgIGlmICghZG9uZSkge1xuICAgICAgICAgICAgICAgICAgICBhUmVxW2ldID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBhUmVxW2ldID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShzdGVwKTtcbiAgICB9O1xufTtcblxuXG5cbmV4cG9ydCB7XG4gICAgZXh0ZW5kZWRTbGlkZXJzLFxufTtcbiIsIi8qKlxuICogU2ltcGxlIHNsaWRlciB0eXBlXG4gKi9cbmltcG9ydCB7IGlzQXV0b1BsYXlPbiB9IGZyb20gJy4uLy4uL2xpYnJhcnkvc2xpZGVycy9zbGlkZXItb3B0aW9ucy9hdXRvcGxheSc7XG5pbXBvcnQgeyBpc0xhenlMb2FkT24gfSBmcm9tICcuLi8uLi9saWJyYXJ5L3NsaWRlcnMvc2xpZGVyLW9wdGlvbnMvbGF6eSc7XG5pbXBvcnQgeyBpc0JyZWFrcG9pbnRzT24gfSBmcm9tICcuLi8uLi9saWJyYXJ5L3NsaWRlcnMvc2xpZGVyLW9wdGlvbnMvYnJlYWtwb2ludHMnO1xuaW1wb3J0IHsgaXNOYXZpZ2F0aW9uT24gfSBmcm9tICcuLi8uLi9saWJyYXJ5L3NsaWRlcnMvc2xpZGVyLW9wdGlvbnMvbmF2aWdhdGlvbic7XG5pbXBvcnQgeyBpc1BhZ2luYXRpb25PbiB9IGZyb20gJy4uLy4uL2xpYnJhcnkvc2xpZGVycy9zbGlkZXItb3B0aW9ucy9wYWdpbmF0aW9uJztcbmltcG9ydCB7IGlzTG9vcE9uIH0gZnJvbSAnLi4vLi4vbGlicmFyeS9zbGlkZXJzL3NsaWRlci1vcHRpb25zL2xvb3AnO1xuaW1wb3J0IHsgdV9wYXJzZUJvb2wgfSBmcm9tICcuLi8uLi91dGlscy91X3R5cGVzJztcbmltcG9ydCB7IGF1dG9wbGF5T2JzZXJ2ZXIgfSBmcm9tICcuLi8uLi9saWJyYXJ5L3NsaWRlcnMvc2xpZGVyLW9wdGlvbnMvYXV0b3BsYXlPYnNlcnZlcic7XG5cbi8vIGNvbmZpZyBzZWxlY3RvcnMgb25seSBoZXJlXG5jb25zdCBzaW1wbGVOYW1lID0gJ2pzLXNsaWRlci1zaW1wbGUnO1xuY29uc3Qgc2ltcGxlU2xpZGVyU2VsID0gJy5qcy1zbGlkZXItc2ltcGxlJztcblxuLy8gZmluZCB0aG9zZSBzZWxlY3RvcnNcbmNvbnN0IHNpbXBsZVNsaWRlckxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNpbXBsZVNsaWRlclNlbCk7XG5cbmNvbnN0IHNpbXBsZVNsaWRlcnMgPSAoKSA9PiB7XG4gICAgLy8gbG9vcCB0aHJvdWdoIHNsaWRlcnMgYW5kIGFkZCBJRCdzIHRvIGl0XG5cbiAgICBjb25zdCBzaW1wbGVTbGlkZXJPcHRpb25zID0gW107XG4gICAgY29uc3Qgc2ltcGxlU2xpZGVyc0xpc3QgPSBbXTtcbiAgICBjb25zdCBzaW1wbGVPYnNlcnZlciA9IFtdO1xuXG4gICAgc2ltcGxlU2xpZGVyTGlzdC5mb3JFYWNoKChzbGlkZXIsIGkpID0+IHtcbiAgICAgICAgc2ltcGxlU2xpZGVyT3B0aW9uc1tpXSA9IHt9O1xuICAgICAgICBjb25zdCBzbGlkZXJJRCA9IGAke3NpbXBsZU5hbWV9LSR7aX1gO1xuICAgICAgICBzbGlkZXIuc2V0QXR0cmlidXRlKCdpZCcsIHNsaWRlcklEKTtcblxuICAgICAgICBzaW1wbGVTbGlkZXJPcHRpb25zW2ldID0gaXNBdXRvUGxheU9uKHNsaWRlciwgc2ltcGxlU2xpZGVyT3B0aW9uc1tpXSk7XG4gICAgICAgIHNpbXBsZVNsaWRlck9wdGlvbnNbaV0gPSBpc0xhenlMb2FkT24oc2xpZGVyLCBzaW1wbGVTbGlkZXJPcHRpb25zW2ldKTtcbiAgICAgICAgc2ltcGxlU2xpZGVyT3B0aW9uc1tpXSA9IGlzUGFnaW5hdGlvbk9uKHNsaWRlciwgc2ltcGxlU2xpZGVyT3B0aW9uc1tpXSk7XG4gICAgICAgIHNpbXBsZVNsaWRlck9wdGlvbnNbaV0gPSBpc0JyZWFrcG9pbnRzT24oc2xpZGVyLCBzaW1wbGVTbGlkZXJPcHRpb25zW2ldKTtcbiAgICAgICAgc2ltcGxlU2xpZGVyT3B0aW9uc1tpXSA9IGlzTG9vcE9uKHNsaWRlciwgc2ltcGxlU2xpZGVyT3B0aW9uc1tpXSk7XG5cbiAgICAgICAgLy8gLm0tc2xpZGVyIHBhcmVudCBpcyBoYXJkY29kZWQgaW4gaXNOYXZpZ2F0aW9uT24gb3B0aW9uc1xuICAgICAgICBzaW1wbGVTbGlkZXJPcHRpb25zW2ldID0gaXNOYXZpZ2F0aW9uT24oc2xpZGVyLCBzaW1wbGVTbGlkZXJPcHRpb25zW2ldLCBzaW1wbGVOYW1lLCBpKTtcblxuICAgICAgICBzaW1wbGVTbGlkZXJzTGlzdFtpXSA9IG5ldyBTd2lwZXIoc2xpZGVyLCBzaW1wbGVTbGlkZXJPcHRpb25zW2ldKTtcblxuICAgICAgICBpZiAoc2xpZGVyLmNsYXNzTGlzdC5jb250YWlucygnc2xpZGVyLWZpbHRlci10YWJzJykpIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11c2UtYmVmb3JlLWRlZmluZVxuICAgICAgICAgICAgZmlsdGVyU2xpZGVycyhzbGlkZXIsIHNpbXBsZVNsaWRlcnNMaXN0W2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlzQXV0b3BsYXkgPSBzbGlkZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXNsaWRlci1hdXRvcGxheScpO1xuICAgICAgICBjb25zdCBhdXRvcGxheU9ic2VydmUgPSB1X3BhcnNlQm9vbChzbGlkZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXNsaWRlci1hdXRvcGxheS1vYnNlcnZlcicpKTtcblxuICAgICAgICBpZiAoaXNBdXRvcGxheSAmJiBhdXRvcGxheU9ic2VydmUpIHtcbiAgICAgICAgICAgIHNpbXBsZVNsaWRlcnNMaXN0W2ldLmF1dG9wbGF5LnN0b3AoKTtcbiAgICAgICAgICAgIHNpbXBsZU9ic2VydmVyLnB1c2goe1xuICAgICAgICAgICAgICAgIHNsaWRlcjogc2xpZGVySUQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZygnc2xpZGVyIGNvbHVtbnMnLCBzbGlkZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXNsaWRlci1jb2x1bW5zJykpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnc2xpZGVyIGl0ZW1zJywgc2xpZGVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zd2lwZXItc2xpZGUnKS5sZW5ndGgpO1xuXG4gICAgICAgIGxldCBzbGlkZXJDb2x1bW5zID0gc2xpZGVyLmdldEF0dHJpYnV0ZSgnZGF0YS1zbGlkZXItY29sdW1ucycpO1xuICAgICAgICBsZXQgc2xpZGVySXRlbXMgPSBzbGlkZXIucXVlcnlTZWxlY3RvckFsbCgnLnN3aXBlci1zbGlkZScpLmxlbmd0aDtcblxuICAgICAgICBpZiAod2luZG93LnNjcmVlbi53aWR0aCA+PSAxMDI0ICYmIHNsaWRlckl0ZW1zIDw9IHNsaWRlckNvbHVtbnMpIHtcbiAgICAgICAgICAgIHNsaWRlci5jbGFzc0xpc3QuYWRkKCctaGlkZS1wYWdpbmF0aW9uJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzbGlkZXIuY2xhc3NMaXN0LnJlbW92ZSgnLWhpZGUtcGFnaW5hdGlvbicpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZXh0cmEgdGh1bWJuYWlscyBuYXZcbiAgICAgICAgZm9yIChjb25zdCB0aHVtYnNOYXYgb2Ygc2xpZGVyLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbCgnLmpzLWV4dHJhLW5hdicpKXtcbiAgICAgICAgICAgIGNvbnN0IHRodW1ic05hdkJ0bnMgPSB0aHVtYnNOYXYucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtanMtc2xpZGVdJyk7XG4gICAgICAgICAgICBzaW1wbGVTbGlkZXJzTGlzdFtpXS5vbignc2xpZGVDaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG90YWxTbGlkZXMgPSBzbGlkZXIucXVlcnlTZWxlY3RvckFsbCgnLnN3aXBlci1zbGlkZTpub3QoLnN3aXBlci1zbGlkZS1kdXBsaWNhdGUpJykubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1ckluZGV4ID0gKHNpbXBsZVNsaWRlcnNMaXN0W2ldLnJlYWxJbmRleCAlIHRvdGFsU2xpZGVzKSArIDE7XG4gICAgICAgICAgICAgICAgdGh1bWJzTmF2LnN0eWxlLnNldFByb3BlcnR5KCctLW5hdmlnYXRpb24taXRlbXMtY3VycmVudCcsIGN1ckluZGV4KTtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHRodW1ic05hdkJ0biBvZiB0aHVtYnNOYXZCdG5zKVxuICAgICAgICAgICAgICAgICAgICB0aHVtYnNOYXZCdG4uY2xhc3NMaXN0W2N1ckluZGV4ID09ICQodGh1bWJzTmF2QnRuKS5kYXRhKCdqcy1zbGlkZScpID8gJ2FkZCcgOiAncmVtb3ZlJ10oJy1hY3RpdmUnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZm9yIChjb25zdCB0aHVtYnNOYXZCdG4gb2YgdGh1bWJzTmF2QnRucylcbiAgICAgICAgICAgICAgICB0aHVtYnNOYXZCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBnb3RvID0gJChlLnRhcmdldCkuY2xvc2VzdCgnW2RhdGEtanMtc2xpZGVdJykuZGF0YSgnanMtc2xpZGUnKTtcbiAgICAgICAgICAgICAgICAgICAgc2ltcGxlU2xpZGVyc0xpc3RbaV0uc2xpZGVUb0xvb3AoZ290by0xKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKHNpbXBsZU9ic2VydmVyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgYXV0b3BsYXlPYnNlcnZlcihzaW1wbGVPYnNlcnZlciwgc2ltcGxlTmFtZSwgc2ltcGxlU2xpZGVyc0xpc3QpO1xuICAgIH1cblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIC8vIGlmICghaXNIYXNoZWQpIHtcbiAgICAgICAgLy8gICAgIC8vYWxlcnQoXCJsb2NhdGlvbjogXCIgKyBkb2N1bWVudC5sb2NhdGlvbiArIFwiLFxuICAgICAgICAvLyAgICAgc3RhdGU6IFwiICsgSlNPTi5zdHJpbmdpZnkoZXZlbnQuc3RhdGUpKTtcbiAgICAgICAgLy8gfVxuICAgIH0sIGZhbHNlKTtcblxufTtcblxuY29uc3QgZmlsdGVyU2xpZGVycyA9IChzZWxlY3Rvciwgc2xpZGVyKSA9PiB7XG4gICAgaWYgKCFzZWxlY3RvcikgcmV0dXJuO1xuICAgIGNvbnN0IHNsaWRlckNvbnRhaW5lciA9IHNlbGVjdG9yLmNsb3Nlc3QoJy5tLXNsaWRlcicpO1xuICAgIGNvbnN0IHNsaWRlcyA9IHNlbGVjdG9yLnF1ZXJ5U2VsZWN0b3JBbGwoJy5tLXNsaWRlcl9fc2xpZGUnKTtcbiAgICBjb25zdCBmaWx0ZXJDb250YWluZXIgPSBzbGlkZXJDb250YWluZXIucXVlcnlTZWxlY3RvcignLmpzLXNsaWRlci1mbmF2Jyk7XG4gICAgaWYgKCFmaWx0ZXJDb250YWluZXIpIHJldHVybjtcbiAgICBjb25zdCBmaWx0ZXJJdGVtcyA9IGZpbHRlckNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcuanMtZmlsdGVyLWZuYXYtaXRlbSBhJyk7XG4gICAgY29uc3QgZmlsdGVyRHJvcGRvd24gPSBmaWx0ZXJDb250YWluZXIucXVlcnlTZWxlY3RvcignLmpzLXNsaWRlci1mbmF2LWRyb3Bkb3duJyk7XG4gICAgbGV0IGlzSGFzaGVkID0gZmFsc2U7XG4gICAgZmlsdGVySXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjbGlja2VkSXRlbSA9IGV2LmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgICAgICBjb25zdCBjbGlja2VkSXRlbVBhcmVudCA9IGNsaWNrZWRJdGVtLmNsb3Nlc3QoJy5qcy1maWx0ZXItZm5hdi1pdGVtJyk7XG4gICAgICAgICAgICAvLyBjb25zdCBocmVmID0gY2xpY2tlZEl0ZW0uXG5cbiAgICAgICAgICAgIGlmIChjbGlja2VkSXRlbVBhcmVudC5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLWFjdGl2ZScpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmaWx0ZXJJdGVtcy5mb3JFYWNoKChjbGlja2VkKSA9PiB7XG4gICAgICAgICAgICAgICAgY2xpY2tlZC5jbG9zZXN0KCcuanMtZmlsdGVyLWZuYXYtaXRlbScpLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjbGlja2VkSXRlbVBhcmVudC5jbGFzc0xpc3QuYWRkKCdpcy1hY3RpdmUnKTtcblxuICAgICAgICAgICAgY29uc3QgY2xpY2tlZEZpbHRlciA9IGV2LmN1cnJlbnRUYXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLXNsaWRlci1maWx0ZXInKTtcbiAgICAgICAgICAgIGNvbnN0IGNsaWNrZWRIcmVmID0gZXYuY3VycmVudFRhcmdldC5nZXRBdHRyaWJ1dGUoJ2hyZWYnKTtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAoY2xpY2tlZEhyZWYuaW5kZXhPZignIycpID4gLTEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB1cmxTcGxpdCA9IGNsaWNrZWRIcmVmLnNwbGl0KCcjJyk7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3SGFzaCA9IHVybFNwbGl0WzFdO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gbmV3SGFzaDtcbiAgICAgICAgICAgICAgICBpc0hhc2hlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGNsaWNrZWRIcmVmLCAnIDUnKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGlzSGFzaGVkLCAnMScpO1xuICAgICAgICAgICAgZmlsdGVyU2xpZGVzKGNsaWNrZWRGaWx0ZXIpO1xuXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgY29uc3QgZmlsdGVyU2xpZGVzID0gKGZpbHRlcikgPT4ge1xuICAgICAgICBsZXQgZmlsdGVyU3RyaW5nID0gZmlsdGVyO1xuICAgICAgICBpZiAoZmlsdGVyU3RyaW5nID09PSAnYWxsJykgZmlsdGVyU3RyaW5nID0gJyc7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzbGlkZXMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IHNsaWRlc0NhdGVnb3JpZXMgPSBzbGlkZXNbaV0uZ2V0QXR0cmlidXRlKCdkYXRhLWNhdGVnb3JpZXMnKS5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgbGV0IGhhc0ZpbHRlciA9IGZhbHNlO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzbGlkZXNDYXRlZ29yaWVzLmxlbmd0aDsgaiArPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNsaWRlc0NhdGVnb3JpZXNbal0uaW5kZXhPZihmaWx0ZXJTdHJpbmcpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBoYXNGaWx0ZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGhhc0ZpbHRlcikge1xuICAgICAgICAgICAgICAgIHNsaWRlc1tpXS5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gICAgICAgICAgICAgICAgc2xpZGVzW2ldLmNsYXNzTGlzdC5hZGQoJ3N3aXBlci1zbGlkZScpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzbGlkZXNbaV0uY2xhc3NMaXN0LnJlbW92ZSgnc3dpcGVyLXNsaWRlJyk7XG4gICAgICAgICAgICAgICAgc2xpZGVzW2ldLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhzbGlkZXNDYXRlZ29yaWVzKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHNsaWRlc1tpXS5nZXRBdHRyaWJ1dGUoJ2RhdGEtY2F0ZWdvcmllcycpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNsaWRlci51cGRhdGVTaXplKCk7XG4gICAgICAgIHNsaWRlci51cGRhdGVTbGlkZXMoKTtcbiAgICAgICAgc2xpZGVyLnVwZGF0ZVByb2dyZXNzKCk7XG4gICAgICAgIHNsaWRlci51cGRhdGVTbGlkZXNDbGFzc2VzKCk7XG4gICAgICAgIHNsaWRlci5zbGlkZVRvTG9vcCgwKTtcbiAgICAgICAgc2xpZGVyLnNjcm9sbGJhci51cGRhdGVTaXplKCk7XG5cbiAgICB9O1xuICAgIC8vIHdpbmRvdy5vbnBvcHN0YXRlID0gZnVuY3Rpb24oZXZlbnQpXG4gICAgLy8ge1xuICAgIC8vICAgICBjb25zb2xlLmxvZyhpc0hhc2hlZCwgJzAnKTtcbiAgICAvLyAgICAgaWYoaXNIYXNoZWQpIHtcbiAgICAvLyAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgLy8gICAgICAgICBpc0hhc2hlZCA9IGZhbHNlO1xuICAgIC8vICAgICAgICAgcmV0dXJuO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKGlzSGFzaGVkLCAnMicpO1xuICAgIC8vXG4gICAgLy8gICAgIGFsZXJ0KFwibG9jYXRpb246IFwiICsgZG9jdW1lbnQubG9jYXRpb24gKyBcIiwgc3RhdGU6IFwiICsgSlNPTi5zdHJpbmdpZnkoZXZlbnQuc3RhdGUpKTtcbiAgICAvLyB9O1xufTtcblxuZXhwb3J0IHtcbiAgICBzaW1wbGVTbGlkZXJzLFxufTtcbiIsImltcG9ydCBEU01QVGFiVG9BY2NvcmRpb25Nb2JpbGUgZnJvbSAnLi4vbGlicmFyeS90YWJzLWFjY29yZGlvbnMvRFNNUFRhYnNUb0FjY29yZGlvbk1vYmlsZSc7XG5cbmNvbnN0IHRhYmFjY0lEID0gJ2pzLXRhYi1hY2MnO1xuY29uc3QgdGFiYWNjU2VsZWN0b3IgPSAnLmpzLXRhYnMtdG8tYWNjLXdyYXBwZXInO1xuY29uc3QgdGFiYWNjSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRhYmFjY1NlbGVjdG9yKTtcblxuY29uc3QgY2FsbFRhYkFjY29yZGlvbnNNb2JpbGUgPSAoKSA9PiB7XG5cbiAgICB0YWJhY2NJdGVtcy5mb3JFYWNoKCAoYWNjLCBpKSA9PiB7XG4gICAgICAgIGxldCB0YUlEID0gYCR7dGFiYWNjSUR9LSR7aX1gO1xuICAgICAgICBsZXQgY2FsbElEID0gYCMke3RhSUR9YDtcbiAgICAgICAgYWNjLnNldEF0dHJpYnV0ZSgnaWQnLCB0YUlEKTtcblxuICAgICAgICBuZXcgRFNNUFRhYlRvQWNjb3JkaW9uTW9iaWxlKGNhbGxJRCk7XG4gICAgfSk7XG59XG5cblxuZXhwb3J0IHtcbiAgICBjYWxsVGFiQWNjb3JkaW9uc01vYmlsZVxufSIsImNvbnN0IGRzX3JlYWRNb3JlID0gKCkgPT4ge1xuICAgIGNvbnN0IHJlYWRNb3JlV3JhcHBlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucmVhZC1tb3JlLXdyYXBwZXInKTtcbiAgICByZWFkTW9yZVdyYXBwZXJzLmZvckVhY2goKHJlYWRNb3JlV3JhcHBlcikgPT4ge1xuICAgICAgICBjb25zdCByZWFkTW9yZUJ0biA9IHJlYWRNb3JlV3JhcHBlci5xdWVyeVNlbGVjdG9yKCcuanMtcmVhZC1tb3JlLXRvZ2dsZScpO1xuICAgICAgICBjb25zdCBidG5UZXh0Tm9BY3RpdmUgPSByZWFkTW9yZUJ0bi5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2hvdy1sZXNzLXRleHQnKTtcbiAgICAgICAgY29uc3QgYnRuVGV4dEFjdGl2ZSA9IHJlYWRNb3JlQnRuLmNoaWxkcmVuWzBdLnRleHRDb250ZW50O1xuICAgICAgICBjb25zdCByZWFkTW9yZVRleHQgPSByZWFkTW9yZVdyYXBwZXIucXVlcnlTZWxlY3RvcignLnJlYWQtbW9yZS10ZXh0Jyk7XG4gICAgICAgIHJlYWRNb3JlQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXNBY3RpdmUgPSByZWFkTW9yZVdyYXBwZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgIGNvbnN0IHJlYWRNb3JlVGV4dEhlaWdodCA9IHJlYWRNb3JlVGV4dC5zY3JvbGxIZWlnaHQ7XG4gICAgICAgICAgICBpZiAoaXNBY3RpdmUpIHtcbiAgICAgICAgICAgICAgICByZWFkTW9yZVdyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgcmVhZE1vcmVCdG4uY2hpbGRyZW5bMF0udGV4dENvbnRlbnQgPSBidG5UZXh0QWN0aXZlO1xuICAgICAgICAgICAgICAgIHJlYWRNb3JlVGV4dC5zdHlsZS5tYXhIZWlnaHQgPSAwO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZWFkTW9yZVdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgcmVhZE1vcmVCdG4uY2hpbGRyZW5bMF0udGV4dENvbnRlbnQgPSBidG5UZXh0Tm9BY3RpdmU7XG4gICAgICAgICAgICAgICAgcmVhZE1vcmVUZXh0LnN0eWxlLm1heEhlaWdodCA9IGAke3JlYWRNb3JlVGV4dEhlaWdodH1weGA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuZXhwb3J0IHtcbiAgICBkc19yZWFkTW9yZSxcbn07XG4iLCJpbXBvcnQgeyBvcGVuTW9iaWxlTWVudSwgY2xvc2VNb2JpbGVNZW51IH0gZnJvbSAnLi91dGlscy91LW1lbnUnO1xuXG4vKipcbiAqIFRvZ2dsZSBtb2JpbGUgbmF2IG9uIGNsaWNrLlxuICogVG9nZ2xlIGRlc2t0b3AgYnVyZ2VyIG1lbnUgb24gY2xpY2suXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGVsIC0gc2VsZWN0b3IgZm9yIGFkZGluZyBhbiBhY3RpdmUgY2xhc3NcbiAqL1xuXG5jb25zdCBkc19oZWFkZXJNZW51VG9nZ2xlID0gKGVsKSA9PiB7XG4gICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpKSB7XG4gICAgICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xuICAgICAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xuXG4gICAgICAgIGJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlmIChidG4uZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICdmYWxzZScpIHtcbiAgICAgICAgICAgICAgICBvcGVuTW9iaWxlTWVudShidG4sIGJvZHkpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjbG9zZU1vYmlsZU1lbnUoYnRuLCBib2R5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuZXhwb3J0IHtcbiAgICBkc19oZWFkZXJNZW51VG9nZ2xlLFxufTtcbiIsImltcG9ydCB7IHVfaXNUb3VjaERldmljZSB9IGZyb20gJy4uL3V0aWxzL3VfaXMtdG91Y2gtZGV2aWNlJztcbmltcG9ydCB7IGNsb3NlTW9iaWxlTWVudSB9IGZyb20gJy4vdXRpbHMvdS1tZW51JztcblxuLyoqXG4gKiBNb2JpbGUgbWVudSBzd2lwZSB1cCBtZW51IGNsb3NlXG4gKi9cblxuY29uc3QgZHNfaGVhZGVyTW9iaWxlU3dpcGVVcCA9IChlbCkgPT4ge1xuICAgIGNvbnN0IG1vYmlsZU5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXZiYXItbW9iaWxlX19pbm5lcicpO1xuICAgIGlmICghbW9iaWxlTmF2KSByZXR1cm47XG5cbiAgICBjb25zdCBidG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcbiAgICBjb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYm9keScpO1xuXG4gICAgbGV0IHhEb3duID0gbnVsbDtcbiAgICBsZXQgeURvd24gPSBudWxsO1xuICAgIGNvbnN0IHRvdWNoID0gdV9pc1RvdWNoRGV2aWNlKCk7XG5cbiAgICBpZiAodG91Y2gpIHtcbiAgICAgICAgY29uc3QgaXNTY3JvbGxhYmxlWSA9IChlbGVtZW50KSA9PiBlbGVtZW50LnNjcm9sbEhlaWdodCA+IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICAgIGNvbnN0IGhhbmRsZVRvdWNoTW92ZSA9IChldnQpID0+IHtcbiAgICAgICAgICAgIGlmICgheERvd24gfHwgIXlEb3duKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCB4VXAgPSBldnQudG91Y2hlc1swXS5jbGllbnRYO1xuICAgICAgICAgICAgY29uc3QgeVVwID0gZXZ0LnRvdWNoZXNbMF0uY2xpZW50WTtcblxuICAgICAgICAgICAgY29uc3QgeERpZmYgPSB4RG93biAtIHhVcDtcbiAgICAgICAgICAgIGNvbnN0IHlEaWZmID0geURvd24gLSB5VXA7XG5cbiAgICAgICAgICAgIGlmIChNYXRoLmFicyh4RGlmZikgPiBNYXRoLmFicyh5RGlmZikpIHtcbiAgICAgICAgICAgICAgICBpZiAoeERpZmYgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIGxlZnQgc3dpcGUgKi9cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvKiByaWdodCBzd2lwZSAqL1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoeURpZmYgPiAwKSB7XG4gICAgICAgICAgICAgICAgLyogdXAgc3dpcGUgKi9cbiAgICAgICAgICAgICAgICBpZiAoIWlzU2Nyb2xsYWJsZVkobW9iaWxlTmF2KSkge1xuICAgICAgICAgICAgICAgICAgICBjbG9zZU1vYmlsZU1lbnUoYnRuLCBib2R5KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8qIGRvd24gc3dpcGUgKi9cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8qIHJlc2V0IHZhbHVlcyAqL1xuICAgICAgICAgICAgeERvd24gPSBudWxsO1xuICAgICAgICAgICAgeURvd24gPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IGhhbmRsZVRvdWNoU3RhcnQgPSAoZXZ0KSA9PiB7XG4gICAgICAgICAgICB4RG93biA9IGV2dC50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICAgICAgICB5RG93biA9IGV2dC50b3VjaGVzWzBdLmNsaWVudFk7XG4gICAgICAgIH07XG5cbiAgICAgICAgbW9iaWxlTmF2LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIChlKSA9PiB7XG4gICAgICAgICAgICBoYW5kbGVUb3VjaE1vdmUoZSk7XG4gICAgICAgICAgICBtb2JpbGVOYXYucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsICgpID0+IHtcbiAgICAgICAgICAgIH0sIHsgb25jZTogdHJ1ZSB9KTtcbiAgICAgICAgfSwgZmFsc2UpO1xuXG4gICAgICAgIG1vYmlsZU5hdi5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKGUpID0+IHtcbiAgICAgICAgICAgIGhhbmRsZVRvdWNoU3RhcnQoZSk7XG4gICAgICAgICAgICBtb2JpbGVOYXYucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgKCkgPT4ge1xuICAgICAgICAgICAgfSwgeyBvbmNlOiB0cnVlIH0pO1xuICAgICAgICB9LCBmYWxzZSk7XG4gICAgfVxufTtcblxuZXhwb3J0IHtcbiAgICBkc19oZWFkZXJNb2JpbGVTd2lwZVVwLFxufTtcbiIsIi8qKlxuICogU2VhcmNoIE92ZXJsYXlcbiAqL1xuaW1wb3J0IHsgdV9oaWRlRWxlbSwgdV9zaG93RWxlbSB9IGZyb20gJy4uL3V0aWxzL3Vfc2hvdy1oaWRlLWRpc3BsYXknO1xuXG5jb25zdCBkc19oZWFkZXJTZWFyY2ggPSAoKSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWpzPVwic2VhcmNoLXRhcmdldFwiXScpO1xuXG5cbiAgICAvLyBXaGVuIFNlYXJjaCBPdmVybGF5IGV4aXN0c1xuICAgIGlmICh0YXJnZXRzKSB7XG4gICAgICAgIHRhcmdldHMuZm9yRWFjaCh0YXJnZXQgPT4ge1xuICAgICAgICAgICAgY29uc3QgaW5wdXQgPSB0YXJnZXQucXVlcnlTZWxlY3RvcignLnNlYXJjaC1maWVsZCcpO1xuICAgICAgICAgICAgY29uc3Qgc2hvd092ZXJsYXkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdV9zaG93RWxlbSh0YXJnZXQpO1xuICAgICAgICAgICAgICAgIGlucHV0LmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCdkcy1vdmVybGF5LXNlYXJjaCcpO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3QgY2xvc2VPdmVybGF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHVfaGlkZUVsZW0odGFyZ2V0KTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LmNsYXNzTGlzdC5hZGQoJ2RzLW92ZXJsYXktc2VhcmNoJyk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gVHJpZ2dlciBzdWJtaXQgd2hlbiBvcGVuZWRcbiAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQubWF0Y2hlcygnW2RhdGEtanM9XCJzZWFyY2gtdHJpZ2dlclwiXScpICYmIHRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2lzLXNob3duJykpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5wdXQuY2xpY2soKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBPcGVuIGFuIG92ZXJsYXlcbiAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQubWF0Y2hlcygnW2RhdGEtanM9XCJzZWFyY2gtdHJpZ2dlclwiXScpKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgc2hvd092ZXJsYXkoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBDbG9zZSBhbiBvdmVybGF5XG4gICAgICAgICAgICAgICAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJ1tkYXRhLWpzPVwic2VhcmNoLWNsb3NlXCJdJykpIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBjbG9zZU92ZXJsYXkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBmYWxzZSk7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBzZWFyY2ggb3ZlcmxheSBpcyBvcGVuZWRcbiAgICAgICAgICAgICAgICBpZiAoZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2RzLW92ZXJsYXktc2VhcmNoJykpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2xvc2UgYW4gb3ZlcmxheSBvbiBFc2NhcGUga2V5IGNsaWNrXG4gICAgICAgICAgICAgICAgICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScgfHwgZS5rZXlDb2RlID09PSAyNykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2VPdmVybGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuZXhwb3J0IHtcbiAgICBkc19oZWFkZXJTZWFyY2gsXG59O1xuIiwiLyoqXG4gKiBBZGQgY2xhc3Mgb24gc2Nyb2xsIGZvciBzdGlja3kgaGVhZGVyXG4gKiBAcGFyYW0ge3N0cmluZ30gZWwgLSBzZWxlY3RvciBmb3IgYWRkaW5nIGFuIGFjdGl2ZSBjbGFzc1xuICogQHBhcmFtIHtzdHJpbmd9IGVsQ2xhc3MgLSBhY3RpdmUgY2xhc3NcbiAqL1xuXG5pbXBvcnQgeyB1X3Rocm90dGxlZCB9IGZyb20gJy4uL3V0aWxzL3V0aWxzJztcblxuY29uc3QgZHNfaGVhZGVyU3RpY2t5ID0gKGVsLCBlbENsYXNzKSA9PiB7XG4gICAgY29uc3QgJCRoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcbiAgICBjb25zdCBlbEhlaWdodCA9IHBhcnNlSW50KCQkaGVhZGVyLm9mZnNldEhlaWdodCAvIDIsIDEwKTtcbiAgICBjb25zdCBvZmZzZXQgPSBwYXJzZUludChlbEhlaWdodCAvIDUsIDEwKTtcblxuICAgIGNvbnN0IG9uU2Nyb2xsID0gKCkgPT4ge1xuICAgICAgICAvLyBpZiAod2luZG93LnBhZ2VZT2Zmc2V0ID4gKGVsSGVpZ2h0ICsgb2Zmc2V0KSkge1xuICAgICAgICBpZiAod2luZG93LnBhZ2VZT2Zmc2V0ID4gKDI1KSkge1xuICAgICAgICAgICAgJCRoZWFkZXIuY2xhc3NMaXN0LmFkZChlbENsYXNzKTtcbiAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cucGFnZVlPZmZzZXQgPCAoZWxIZWlnaHQgLSBvZmZzZXQpKSB7XG4gICAgICAgICAgICAkJGhlYWRlci5jbGFzc0xpc3QucmVtb3ZlKGVsQ2xhc3MpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IHRocm90dGxlU2Nyb2xsID0gdV90aHJvdHRsZWQoKCkgPT4ge1xuICAgICAgICBvblNjcm9sbCgpO1xuICAgIH0sIDMwKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCAoKSA9PiB7XG4gICAgICAgIHRocm90dGxlU2Nyb2xsKCk7XG4gICAgfSk7XG5cbiAgICBpZiAod2luZG93LnBhZ2VZT2Zmc2V0ID4gKGVsSGVpZ2h0ICsgb2Zmc2V0KSkge1xuICAgICAgICAkJGhlYWRlci5jbGFzc0xpc3QuYWRkKGVsQ2xhc3MpO1xuICAgIH1cblxufTtcblxuZXhwb3J0IHtcbiAgICBkc19oZWFkZXJTdGlja3ksXG59O1xuIiwiLyoqXG4gKiBTdWJtZW51IHRvZ2dsZSBmb3IgTW9iaWxlIE1lbnUgYW5kIERlc2t0b3AgQnVyZ2VyIG1lbnVcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZWwgLSBzZWxlY3RvciBmb3IgYWRkaW5nIGFuIGFjdGl2ZSBjbGFzc1xuICogQHBhcmFtIHtzdHJpbmd9IGNsb3NlRWwgLSBzZWxlY3RvciBmb3IgY2xvc2luZyBhbGwgc3VibWVudSBpdGVtc1xuICovXG5cbmltcG9ydCB7IGNoZWNrQ2hpbGRTdWJNZW51LCBjbG9zZVN1Yk1lbnUsIG9wZW5TdWJNZW51IH0gZnJvbSAnLi91dGlscy91LW1lbnUnO1xuXG5jb25zdCBkc19oZWFkZXJNZW51U3ViTWVudVRvZ2dsZSA9IChlbCwgY2xvc2VFbCkgPT4ge1xuICAgIGNvbnN0IGVsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpO1xuICAgIGlmICghZWxlKSByZXR1cm47XG5cbiAgICBjb25zdCBjbG9zZUVsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY2xvc2VFbCk7XG4gICAgY29uc3QgdG9nZ2xlQnV0dG9ucyA9IGVsZS5xdWVyeVNlbGVjdG9yQWxsKCcuanMtc3ViLW1lbnUtdG9nZ2xlJyk7XG5cbiAgICB0b2dnbGVCdXR0b25zLmZvckVhY2goKHRvZ2dsZUJ1dHRvbikgPT4ge1xuICAgICAgICBjb25zdCB0b2dnbGVDb250ZW50ID0gdG9nZ2xlQnV0dG9uLm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgY29uc3QgdG9nZ2xlQnV0dG9uTWVudUl0ZW0gPSB0b2dnbGVCdXR0b24ucGFyZW50RWxlbWVudDtcblxuICAgICAgICBjbG9zZVN1Yk1lbnUodG9nZ2xlQnV0dG9uLCB0b2dnbGVCdXR0b25NZW51SXRlbSwgdG9nZ2xlQ29udGVudCk7XG5cbiAgICAgICAgdG9nZ2xlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXNUb2dnbGVkID0gdG9nZ2xlQnV0dG9uLmNsYXNzTmFtZS5pbmNsdWRlcygnaXMtdG9nZ2xlZCcpO1xuXG4gICAgICAgICAgICBjbG9zZVN1Yk1lbnUodG9nZ2xlQnV0dG9uLCB0b2dnbGVCdXR0b25NZW51SXRlbSwgdG9nZ2xlQ29udGVudCk7XG4gICAgICAgICAgICBjaGVja0NoaWxkU3ViTWVudSh0b2dnbGVCdXR0b24pO1xuXG4gICAgICAgICAgICBpZiAoIWlzVG9nZ2xlZCkge1xuICAgICAgICAgICAgICAgIG9wZW5TdWJNZW51KHRvZ2dsZUJ1dHRvbiwgdG9nZ2xlQnV0dG9uTWVudUl0ZW0sIHRvZ2dsZUNvbnRlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGlmIChjbG9zZUVsZSkge1xuICAgICAgICBjbG9zZUVsZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgIHRvZ2dsZUJ1dHRvbnMuZm9yRWFjaCgodG9nZ2xlQnV0dG9uKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9nZ2xlQ29udGVudCA9IHRvZ2dsZUJ1dHRvbi5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgY29uc3QgdG9nZ2xlQnV0dG9uTWVudUl0ZW0gPSB0b2dnbGVCdXR0b24ucGFyZW50RWxlbWVudDtcblxuICAgICAgICAgICAgICAgIGNsb3NlU3ViTWVudSh0b2dnbGVCdXR0b24sIHRvZ2dsZUJ1dHRvbk1lbnVJdGVtLCB0b2dnbGVDb250ZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW51LWxhbmd1YWdlLW1lbnUtMSwgI21lbnUtc2Vjb25kYXJ5LWxhbmd1YWdlLW1lbnUtMVwiKTtcblxuICAgIGlmIChlbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IG5ld0l0ZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgIG5ld0l0ZW0uY2xhc3NOYW1lID0gXCJsaW5rcy1saXN0X19pdGVtXCI7XG5cbiAgICAgICAgbmV3SXRlbS5hcHBlbmRDaGlsZChlbGVtZW50KTtcblxuICAgICAgICBjb25zdCBkZXN0aW5hdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubmF2YmFyLW1vYmlsZV9faW5uZXIgPiAubGlua3MtbGlzdFwiKTtcblxuICAgICAgICBpZiAoZGVzdGluYXRpb24pIHtcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uLmFwcGVuZENoaWxkKG5ld0l0ZW0pO1xuXG4gICAgICAgICAgICBjb25zdCBwYXJlbnQgPSBlbGVtZW50LnBhcmVudE5vZGUucGFyZW50Tm9kZTtcblxuICAgICAgICAgICAgaWYgKCBwYXJlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKFwic2l0ZS1oZWFkZXJfX3dpZGdldFwiKSApIHtcbiAgICAgICAgICAgICAgICBwYXJlbnQucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI21lbnUtbGFuZ3VhZ2UtbWVudS0xID4gbGkgPiBhLCAjbWVudS1zZWNvbmRhcnktbGFuZ3VhZ2UtbWVudS0xID4gbGkgPiBhXCIpO1xuXG4gICAgICAgICAgICBsaW5rLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJNZW51ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNtZW51LWxhbmd1YWdlLW1lbnUtMSA+IGxpID4gLnN1Yi1tZW51LCAjbWVudS1zZWNvbmRhcnktbGFuZ3VhZ2UtbWVudS0xID4gbGkgPiAuc3ViLW1lbnVcIik7XG5cbiAgICAgICAgICAgICAgICBpZiAoc3ViTWVudSkge1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGxpbmsuY2xhc3NMaXN0LmFkZChcImlzLWFjdGl2ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgc3ViTWVudS5jbGFzc0xpc3QuYWRkKFwiaXMtdmlzaWJsZVwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdmb2N1c291dCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc3ViTWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjbWVudS1sYW5ndWFnZS1tZW51LTEgPiBsaSA+IC5zdWItbWVudSwgI21lbnUtc2Vjb25kYXJ5LWxhbmd1YWdlLW1lbnUtMSA+IGxpID4gLnN1Yi1tZW51XCIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHN1Yk1lbnUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGluay5jbGFzc0xpc3QucmVtb3ZlKFwiaXMtYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgICAgICBzdWJNZW51LmNsYXNzTGlzdC5yZW1vdmUoXCJpcy12aXNpYmxlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuZXhwb3J0IHtcbiAgICBkc19oZWFkZXJNZW51U3ViTWVudVRvZ2dsZSxcbn07XG4iLCJleHBvcnQgZnVuY3Rpb24gZHNfcHVtYUdsb2JhbCgpIHtcbiAgICAkKGRvY3VtZW50KS5jbGljayhmdW5jdGlvbihldmVudCkge1xuICAgICAgICBpZiAoJCgnLnB1bWEtZ2xvYmFsJykuaGFzQ2xhc3MoJ2lzLWFjdGl2ZScpKSB7XG4gICAgICAgICAgICBsZXQgJHRhcmdldCA9ICQoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgICAgIGlmKCEkdGFyZ2V0LmNsb3Nlc3QoJy5wdW1hLWdsb2JhbCcpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICQoJy5wdW1hLWdsb2JhbCcpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJCgnLmpzLXB1bWEtZ2xvYmFsJykub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIGlmICgkKCcucHVtYS1nbG9iYWwnKS5oYXNDbGFzcygnaXMtYWN0aXZlJykpIHtcbiAgICAgICAgICAgICQoJy5wdW1hLWdsb2JhbCcpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICQoJy5wdW1hLWdsb2JhbCcpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKCQod2luZG93KS53aWR0aCgpID4gNzY3KSB7XG4gICAgICAgICQoJy5wdW1hLWdsb2JhbCAuYy1hY2NvcmRpb25fX2NvbnRlbnQnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IGNvdW50cmllcyA9ICQodGhpcykuZmluZCgnLmNvdW50cnknKTtcbiAgICAgICAgICAgIGxldCBjb2x1bW5zID0gTWF0aC5jZWlsKGNvdW50cmllcy5sZW5ndGggLyA1KTtcbiAgICAgICAgICAgIGNvbHVtbnMgPSBjb2x1bW5zID4gNSA/IDUgOiBjb2x1bW5zO1xuICAgICAgICAgICAgbGV0IGl0ZW1zUGVyQ29sdW1uID0gNTtcblxuICAgICAgICAgICAgZm9yICggbGV0IGkgPSAwOyBpIDwgY29sdW1uczsgaSsrICkge1xuICAgICAgICAgICAgICAgIGxldCBjb2x1bW4gPSAkKCc8ZGl2PicpLmFkZENsYXNzKCdjb2x1bW4nKTtcblxuICAgICAgICAgICAgICAgIGZvciAoIGxldCBqID0gMDsgaiA8IGl0ZW1zUGVyQ29sdW1uOyBqKysgKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjb3VudHJ5ID0gY291bnRyaWVzW2kgKiBpdGVtc1BlckNvbHVtbiArIGpdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGNvdW50cnkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW4uYXBwZW5kKGNvdW50cnkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hcHBlbmQoY29sdW1uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuIiwiLy8gT3BlbiBtb2JpbGUgbWVudVxuY29uc3Qgb3Blbk1vYmlsZU1lbnUgPSAoYnRuLCBib2R5KSA9PiB7XG4gICAgYnRuLmNsYXNzTGlzdC5hZGQoJ2lzLWFjdGl2ZScpO1xuICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgnbmF2LWFjdGl2ZScpO1xuICAgIGJ0bi5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xufTtcblxuLy8gQ2xvc2UgbW9iaWxlIG1lbnVcbmNvbnN0IGNsb3NlTW9iaWxlTWVudSA9IChidG4sIGJvZHkpID0+IHtcbiAgICBidG4uY2xhc3NMaXN0LnJlbW92ZSgnaXMtYWN0aXZlJyk7XG4gICAgYm9keS5jbGFzc0xpc3QucmVtb3ZlKCduYXYtYWN0aXZlJyk7XG4gICAgYnRuLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xufTtcblxuLy8gU2hvdyBzdWJtZW51IGl0ZW1zXG5jb25zdCBzaG93SGlkZVN1Ykl0ZW0gPSAoc3ViSXRlbSwgdHlwZSwgYXJpYUF0dHIpID0+IHtcbiAgICBpZiAoc3ViSXRlbSkge1xuICAgICAgICBzdWJJdGVtLmNsYXNzTGlzdFt0eXBlXSgnaXMtdmlzaWJsZScpO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgICAgICAgc3ViSXRlbS5hcmlhRXhwYW5kZWQgPSBbYXJpYUF0dHJdO1xuICAgICAgICAvLyBzdWJJdGVtLnN0eWxlLmhlaWdodCA9IGAkeyBoZWlnaHQgfXB4YDtcbiAgICB9XG59O1xuXG4vLyBPcGVuIHN1Ym1lbnVcbmNvbnN0IG9wZW5TdWJNZW51ID0gKGl0ZW0sIGl0ZW1QYXJlbnQsIGl0ZW1NZW51KSA9PiB7XG4gICAgaXRlbS5jbGFzc0xpc3QuYWRkKCdpcy10b2dnbGVkJyk7XG4gICAgaXRlbVBhcmVudC5jbGFzc0xpc3QuYWRkKCdpcy1vcGVuZWQnKTtcbiAgICBzaG93SGlkZVN1Ykl0ZW0oaXRlbU1lbnUsICdhZGQnLCAndHJ1ZScpO1xufTtcblxuLy8gQ2xvc2Ugc3VibWVudVxuY29uc3QgY2xvc2VTdWJNZW51ID0gKGl0ZW0sIGl0ZW1QYXJlbnQsIGl0ZW1NZW51KSA9PiB7XG4gICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdpcy10b2dnbGVkJyk7XG4gICAgaXRlbVBhcmVudC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1vcGVuZWQnKTtcbiAgICBzaG93SGlkZVN1Ykl0ZW0oaXRlbU1lbnUsICdyZW1vdmUnLCAnZmFsc2UnKTtcbn07XG5cbi8vIENoZWNrIGZvciBzdWJtZW51IGl0ZW1zXG5jb25zdCBjaGVja0NoaWxkU3ViTWVudSA9IChpdGVtKSA9PiB7XG4gICAgY29uc3QgdG9nZ2xlSW5uZXJCdXR0b24gPSBBcnJheS5mcm9tKGl0ZW0ubmV4dEVsZW1lbnRTaWJsaW5nLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2pzLXN1Yi1tZW51LXRvZ2dsZScpKTtcbiAgICBpZiAodG9nZ2xlSW5uZXJCdXR0b24pIHtcbiAgICAgICAgdG9nZ2xlSW5uZXJCdXR0b24uZm9yRWFjaCgoaW5uZXJJdGVtKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjaGlsZFN1Yk1lbnUgPSBpbm5lckl0ZW0ubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICAgICAgaWYgKGNoaWxkU3ViTWVudS5hcmlhRXhwYW5kZWQgPT09ICd0cnVlJykge1xuICAgICAgICAgICAgICAgIGNoaWxkU3ViTWVudS5hcmlhRXhwYW5kZWQgPSAnZmFsc2UnO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjaGlsZFN1Yk1lbnUuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy12aXNpYmxlJykpIHtcbiAgICAgICAgICAgICAgICBjaGlsZFN1Yk1lbnUuYXJpYUV4cGFuZGVkID0gJ3RydWUnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xuXG5leHBvcnQge1xuICAgIG9wZW5Nb2JpbGVNZW51LCBjbG9zZU1vYmlsZU1lbnUsIGNsb3NlU3ViTWVudSwgb3BlblN1Yk1lbnUsIGNoZWNrQ2hpbGRTdWJNZW51LFxufTtcbiIsIi8qKlxuICogSW1hZ2UgU3Bpbm5lciBPcHRpb25zIC0gYXV0byBhbmltYXRpb25cbiAqL1xuXG5jb25zdCBpc0FuaW1hdGVPbiA9IChlbGVtLCBvcHRpb25zKSA9PiB7XG4gICAgaWYgKCFlbGVtKSByZXR1cm4gb3B0aW9ucztcblxuICAgIGxldCBpc0FuaW1hdGUgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1zcGlubmVyLWF1dG9hbmltYXRlJyk7XG5cbiAgICBpZiAoaXNBbmltYXRlID09PSAndHJ1ZScpIHtcbiAgICAgICAgb3B0aW9ucy5hbmltYXRlID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9ucztcbn1cblxuXG5leHBvcnQge1xuICAgIGlzQW5pbWF0ZU9uXG59IiwiLyoqXG4gKiBJbWFnZSBTcGlubmVyIENvbnRyb2xzIC0gRnJhbWUgYnkgZnJhbWUgbmF2aWdhdGlvblxuICovXG5cbmNvbnN0IGlzRnJhbWVzTmF2T24gPSAoZWxlbSwgb3B0aW9ucykgPT4ge1xuICAgIGlmICghZWxlbSkgcmV0dXJuIG9wdGlvbnM7XG5cbiAgICBsZXQgaXNGcmFtZXNOYXYgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1jdHJsLWZyYW1lcy1uYXYnKTtcblxuICAgIGlmIChpc0ZyYW1lc05hdiA9PT0gJ3RydWUnKSB7XG4gICAgICAgIG9wdGlvbnMucGx1Z2lucy5wdXNoKCdkc0ZyYW1lc05hdkNvbnRyb2wnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9ucztcbn1cblxuXG5leHBvcnQge1xuICAgIGlzRnJhbWVzTmF2T25cbn0iLCIvKipcbiAqIEltYWdlIFNwaW5uZXIgQ29udHJvbHMgLSBGdWxsIFNjcmVlblxuICovXG5cbmNvbnN0IGlzRnVsbFNjcmVlbk9uID0gKGVsZW0sIG9wdGlvbnMpID0+IHtcbiAgICBpZiAoIWVsZW0pIHJldHVybiBvcHRpb25zO1xuXG4gICAgbGV0IGlzRnVsbFNjcmVlbiA9IGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWN0cmwtZnVsbHNjcicpO1xuXG4gICAgaWYgKGlzRnVsbFNjcmVlbiA9PT0gJ3RydWUnKSB7XG4gICAgICAgIG9wdGlvbnMucGx1Z2lucy5wdXNoKCdkc0Z1bGxTY3JlZW5Db250cm9sJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnM7XG59XG5cblxuZXhwb3J0IHtcbiAgICBpc0Z1bGxTY3JlZW5PblxufSIsIi8qKlxuICogSW1hZ2UgU3Bpbm5lciBDb250cm9scyAtIEhvdHNwb3RzIG5hdmlnYXRpb25cbiAqL1xuXG5jb25zdCBpc0hvdHNwb3RzT24gPSAoZWxlbSwgb3B0aW9ucykgPT4ge1xuICAgIGlmICghZWxlbSkgcmV0dXJuIG9wdGlvbnM7XG5cbiAgICBsZXQgaXNIb3RzcG90cyA9IGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXNwaW5uZXItaGFzLWhvdHNwb3RzJyk7XG5cbiAgICBpZiAoaXNIb3RzcG90cyA9PT0gJ3RydWUnKSB7XG4gICAgICAgIG9wdGlvbnMucGx1Z2lucy5wdXNoKCdkc0hvdFNwb3RzJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnM7XG59XG5cblxuZXhwb3J0IHtcbiAgICBpc0hvdHNwb3RzT25cbn0iLCIvKipcbiAqIEltYWdlIFNwaW5uZXIgQ29udHJvbHMgLSBQbGF5YmFja1xuICovXG5cbmNvbnN0IGlzUGxheWJhY2tPbiA9IChlbGVtLCBvcHRpb25zKSA9PiB7XG4gICAgaWYgKCFlbGVtKSByZXR1cm4gb3B0aW9ucztcblxuICAgIGxldCBpc1BsYXliYWNrID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtY3RybC1wbGF5YmFjaycpO1xuXG4gICAgaWYgKGlzUGxheWJhY2sgPT09ICd0cnVlJykge1xuICAgICAgICBvcHRpb25zLnBsdWdpbnMucHVzaCgnZHNQbGF5YmFja0NvbnRyb2wnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9ucztcbn1cblxuXG5leHBvcnQge1xuICAgIGlzUGxheWJhY2tPblxufSIsIi8qKlxuICogSW1hZ2UgU3Bpbm5lciBPcHRpb25zIC0gUHJvZ3Jlc3MgLSBGcmFjdGlvblxuICovXG5cbmNvbnN0IGlzRnJhY3Rpb25PbiA9IChlbGVtLCBvcHRpb25zKSA9PiB7XG4gICAgaWYgKCFlbGVtKSByZXR1cm4gb3B0aW9ucztcblxuICAgIGxldCBpc0ZyYWN0aW9uID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtY3RybC1wcm9ncmVzcy1mcmFjdGlvbicpO1xuXG4gICAgaWYgKGlzRnJhY3Rpb24gPT09ICd0cnVlJykge1xuICAgICAgICBvcHRpb25zLnBsdWdpbnMucHVzaCgnZHNQcm9ncmVzc0ZyYWN0aW9uJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnM7XG59XG5cblxuZXhwb3J0IHtcbiAgICBpc0ZyYWN0aW9uT25cbn0iLCIvKipcbiAqIEltYWdlIFNwaW5uZXIgQ29udHJvbHMgLSBab29tXG4gKi9cblxuY29uc3QgaXNab29tT24gPSAoZWxlbSwgb3B0aW9ucykgPT4ge1xuICAgIGlmICghZWxlbSkgcmV0dXJuIG9wdGlvbnM7XG5cbiAgICBsZXQgaXNab29tID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtY3RybC16b29tJyk7XG5cbiAgICBpZiAoaXNab29tID09PSAndHJ1ZScpIHtcbiAgICAgICAgb3B0aW9ucy5wbHVnaW5zLnB1c2goJ2RzWm9vbUNvbnRyb2wnLCAnem9vbScpO1xuICAgIH1cblxuICAgIHJldHVybiBvcHRpb25zO1xufVxuXG5cbmV4cG9ydCB7XG4gICAgaXNab29tT25cbn0iLCIvKipcbiAqIEltYWdlIFNwaW5uZXIgT3B0aW9ucyAtICdkcmFnJyBwbHVnaW5cbiAqL1xuXG5jb25zdCBpc0RyYWdPbiA9IChlbGVtLCBvcHRpb25zKSA9PiB7XG4gICAgaWYgKCFlbGVtKSByZXR1cm4gb3B0aW9ucztcblxuICAgIGxldCBpc0RyYWcgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1zcGlubmVyLWRyYWcnKTtcblxuICAgIGlmIChpc0RyYWcgPT09ICd0cnVlJykge1xuICAgICAgICBvcHRpb25zLnBsdWdpbnMucHVzaCgnZHJhZycpO1xuICAgIH1cblxuICAgIHJldHVybiBvcHRpb25zO1xufVxuXG5cbmV4cG9ydCB7XG4gICAgaXNEcmFnT25cbn0iLCIvKipcbiAqIEltYWdlIFNwaW5uZXIgUGx1Z2luIC0gZHNGcmFtZXNOYXZDb250cm9sXG4gKi9cblxuZnVuY3Rpb24gZnJhbWVzTmF2Q29udHJvbChzcGlubmVyRWxlbSkge1xuICAgIGxldCBhcGkgPSBzcGlubmVyRWxlbS5zcHJpdGVzcGluKCdhcGknKTtcbiAgICBjb25zdCBzcGlubmVyTW9kdWxlID0gc3Bpbm5lckVsZW0uY2xvc2VzdCgnLm0taW1hZ2Utc3Bpbm5lcicpO1xuICAgIGNvbnN0IGhvdHNwb3RFbCA9IHNwaW5uZXJNb2R1bGUuZmluZCgnLmhvdHNwb3QnKTtcbiAgICBjb25zdCBoc0NvbnRlbnRMaXN0SXRlbSA9IHNwaW5uZXJNb2R1bGUuZmluZCgnLmpzLWhvdHNwb3RzLWxpc3QtaXRlbScpO1xuICAgIGNvbnN0IGN0cmxCdHRuUHJldiA9IHNwaW5uZXJNb2R1bGUuZmluZCgnLmpzLWltYWdlLXNwaW5uZXItcHJldicpO1xuICAgIGNvbnN0IGN0cmxCdHRuTmV4dCA9IHNwaW5uZXJNb2R1bGUuZmluZCgnLmpzLWltYWdlLXNwaW5uZXItbmV4dCcpO1xuXG4gICAgaWYgKDAgPCBjdHJsQnR0blByZXYubGVuZ3RoKSB7XG4gICAgICAgIGN0cmxCdHRuUHJldi5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAvLyBHZXQgb3JpZ2luYWwgJ3JldmVyc2UnIHNldHRpbmdcbiAgICAgICAgICAgIGFwaS5kYXRhLnJldmVyc2UgPSBhcGkuZGF0YS5mb3JjZVJldmVyc2U7XG4gICAgICAgICAgICBhcGkucHJldkZyYW1lKCk7XG5cbiAgICAgICAgICAgIC8vIGhpZGUgYWxsIGhvdHNwb3RzXG4gICAgICAgICAgICBob3RzcG90RWwucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgaG90c3BvdEVsLmhpZGUoKTtcbiAgICAgICAgICAgIC8vIGRlYWN0aXZhdGUgYWxsIGxhYmVsc1xuICAgICAgICAgICAgaHNDb250ZW50TGlzdEl0ZW0ucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgLy8gc2hvdyBjdXJyZW50IGhvdHNwb3RzIGZvciB0aGlzIGZyYW1lXG4gICAgICAgICAgICBhcGkuZGF0YS5zdGFnZS5maW5kKFwiLmhvdHNwb3QuaG90c3BvdC1mcmFtZS1cIiArIGFwaS5kYXRhLmZyYW1lKS5zdG9wKGZhbHNlKS5mYWRlSW4oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKDAgPCBjdHJsQnR0bk5leHQubGVuZ3RoKSB7XG4gICAgICAgIGN0cmxCdHRuTmV4dC5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAvLyBHZXQgb3JpZ2luYWwgJ3JldmVyc2UnIHNldHRpbmdcbiAgICAgICAgICAgIGFwaS5kYXRhLnJldmVyc2UgPSBhcGkuZGF0YS5mb3JjZVJldmVyc2U7XG4gICAgICAgICAgICBhcGkubmV4dEZyYW1lKCk7XG5cbiAgICAgICAgICAgIC8vIGhpZGUgYWxsIGhvdHNwb3RzXG4gICAgICAgICAgICBob3RzcG90RWwucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgaG90c3BvdEVsLmhpZGUoKTtcbiAgICAgICAgICAgIC8vIGRlYWN0aXZhdGUgYWxsIGxhYmVsc1xuICAgICAgICAgICAgaHNDb250ZW50TGlzdEl0ZW0ucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgLy8gc2hvdyBjdXJyZW50IGhvdHNwb3RzIGZvciB0aGlzIGZyYW1lXG4gICAgICAgICAgICBhcGkuZGF0YS5zdGFnZS5maW5kKFwiLmhvdHNwb3QuaG90c3BvdC1mcmFtZS1cIiArIGFwaS5kYXRhLmZyYW1lKS5zdG9wKGZhbHNlKS5mYWRlSW4oKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5jb25zdCByZWdpc3RlckZyYW1lc05hdkNvbnRyb2xQbHVnaW4gPSAobGFiZWwpID0+IHtcbiAgICBTcHJpdGVTcGluLnJlZ2lzdGVyUGx1Z2luKGxhYmVsLCB7XG4gICAgICAgIG9uTG9hZDogKGV2KSA9PiB7XG4gICAgICAgICAgICBmcmFtZXNOYXZDb250cm9sKCQoZXYudGFyZ2V0KSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG5leHBvcnQge1xuICAgIHJlZ2lzdGVyRnJhbWVzTmF2Q29udHJvbFBsdWdpblxufSIsIi8qKlxuICogSW1hZ2UgU3Bpbm5lciBQbHVnaW4gLSBkc0Z1bGxTY3JlZW5Db250cm9sXG4gKi9cblxuZnVuY3Rpb24gZnVsbHNjckNvbnRyb2woc3Bpbm5lckVsZW0pIHtcbiAgICBsZXQgYXBpID0gc3Bpbm5lckVsZW0uc3ByaXRlc3BpbignYXBpJyk7XG4gICAgY29uc3Qgc3Bpbm5lck1vZHVsZSA9IHNwaW5uZXJFbGVtLmNsb3Nlc3QoJy5tLWltYWdlLXNwaW5uZXInKTtcblxuICAgIGNvbnN0IGN0cmxCdHRuRnVsbFNjciA9IHNwaW5uZXJNb2R1bGUuZmluZCgnLmpzLWltYWdlLXNwaW5uZXItZnVsbHNjcicpO1xuXG4gICAgaWYgKDAgPCBjdHJsQnR0bkZ1bGxTY3IubGVuZ3RoKSB7XG4gICAgICAgIGN0cmxCdHRuRnVsbFNjci5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBhcGkucmVxdWVzdEZ1bGxzY3JlZW4oKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG5jb25zdCByZWdpc3RlckZ1bGxzY3JDb250cm9sUGx1Z2luID0gKGxhYmVsKSA9PiB7XG4gICAgU3ByaXRlU3Bpbi5yZWdpc3RlclBsdWdpbihsYWJlbCwge1xuICAgICAgICBvbkxvYWQ6IChldikgPT4ge1xuICAgICAgICAgICAgZnVsbHNjckNvbnRyb2woJChldi50YXJnZXQpKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cbmV4cG9ydCB7XG4gICAgcmVnaXN0ZXJGdWxsc2NyQ29udHJvbFBsdWdpblxufSIsIi8qKlxuICogSW1hZ2UgU3Bpbm5lciBQbHVnaW4gLSBkc1BsYXliYWNrQ29udHJvbFxuICovXG5cbmZ1bmN0aW9uIHBsYXliYWNrQ29udHJvbChzcGlubmVyRWxlbSkge1xuICAgIGxldCBhcGkgPSBzcGlubmVyRWxlbS5zcHJpdGVzcGluKCdhcGknKTtcbiAgICBjb25zdCBzcGlubmVyTW9kdWxlID0gc3Bpbm5lckVsZW0uY2xvc2VzdCgnLm0taW1hZ2Utc3Bpbm5lcicpO1xuICAgIGNvbnN0IGhvdHNwb3RFbCA9IHNwaW5uZXJNb2R1bGUuZmluZCgnLmhvdHNwb3QnKTtcbiAgICBjb25zdCBoc0NvbnRlbnRMaXN0SXRlbSA9IHNwaW5uZXJNb2R1bGUuZmluZCgnLmpzLWhvdHNwb3RzLWxpc3QtaXRlbScpO1xuICAgIGNvbnN0IGN0cmxCdHRuUGxheSA9IHNwaW5uZXJNb2R1bGUuZmluZCgnLmpzLWltYWdlLXNwaW5uZXItcGxheScpO1xuXG4gICAgaWYgKDAgPCBjdHJsQnR0blBsYXkubGVuZ3RoKSB7XG4gICAgICAgIGN0cmxCdHRuUGxheS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICAgIC8vIEdldCBvcmlnaW5hbCAncmV2ZXJzZScgc2V0dGluZ1xuICAgICAgICAgICAgYXBpLmRhdGEucmV2ZXJzZSA9IGFwaS5kYXRhLmZvcmNlUmV2ZXJzZTtcblxuICAgICAgICAgICAgYXBpLnRvZ2dsZUFuaW1hdGlvbigpO1xuXG4gICAgICAgICAgICBpZiAodHJ1ZSA9PT0gYXBpLmlzUGxheWluZygpKSB7XG4gICAgICAgICAgICAgICAgaHNDb250ZW50TGlzdEl0ZW0ucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIGhvdHNwb3RFbC5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgaG90c3BvdEVsLmhpZGUoKTtcbiAgICAgICAgICAgICAgICBzcGlubmVyTW9kdWxlLmFkZENsYXNzKCdpcy1wbGF5aW5nJyk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc3Bpbm5lck1vZHVsZS5yZW1vdmVDbGFzcygnaXMtcGxheWluZycpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmNvbnN0IHJlZ2lzdGVyUGxheWJhY2tDb250cm9sUGx1Z2luID0gKGxhYmVsKSA9PiB7XG4gICAgU3ByaXRlU3Bpbi5yZWdpc3RlclBsdWdpbihsYWJlbCwge1xuICAgICAgICBvbkxvYWQ6IChldikgPT4ge1xuICAgICAgICAgICAgcGxheWJhY2tDb250cm9sKCQoZXYudGFyZ2V0KSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG5leHBvcnQge1xuICAgIHJlZ2lzdGVyUGxheWJhY2tDb250cm9sUGx1Z2luXG59IiwiLyoqXG4gKiBJbWFnZSBTcGlubmVyIFBsdWdpbiAtIGRzWm9vbUNvbnRyb2xcbiAqL1xuXG5mdW5jdGlvbiB6b29tQ29udHJvbChzcGlubmVyRWxlbSkge1xuICAgIGxldCBhcGkgPSBzcGlubmVyRWxlbS5zcHJpdGVzcGluKCdhcGknKTtcbiAgICBjb25zdCBzcGlubmVyTW9kdWxlID0gc3Bpbm5lckVsZW0uY2xvc2VzdCgnLm0taW1hZ2Utc3Bpbm5lcicpO1xuXG4gICAgY29uc3QgY3RybEJ0dG5ab29tID0gc3Bpbm5lck1vZHVsZS5maW5kKCcuanMtaW1hZ2Utc3Bpbm5lci16b29tJyk7XG5cbiAgICBpZiAoMCA8IGN0cmxCdHRuWm9vbS5sZW5ndGgpIHtcbiAgICAgICAgY3RybEJ0dG5ab29tLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIGFwaS50b2dnbGVab29tKCk7XG4gICAgICAgICAgICBzcGlubmVyTW9kdWxlLnRvZ2dsZUNsYXNzKCdpcy16b29tJyk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuY29uc3QgcmVnaXN0ZXJab29tQ29udHJvbFBsdWdpbiA9IChsYWJlbCkgPT4ge1xuICAgIFNwcml0ZVNwaW4ucmVnaXN0ZXJQbHVnaW4obGFiZWwsIHtcbiAgICAgICAgb25Mb2FkOiAoZXYpID0+IHtcbiAgICAgICAgICAgIHpvb21Db250cm9sKCQoZXYudGFyZ2V0KSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG5leHBvcnQge1xuICAgIHJlZ2lzdGVyWm9vbUNvbnRyb2xQbHVnaW5cbn0iLCIvKipcbiAqIEltYWdlIFNwaW5uZXIgUGx1Z2luIC0gZHNIb3RTcG90c1xuICovXG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZUl0ZW1JbmRleChpbmRleCwgYXJyKSB7XG4gICAgbGV0IGl0ZW1JbmRleCA9IGluZGV4O1xuXG4gICAgaWYgKGl0ZW1JbmRleCA8IDApIHtcbiAgICAgICAgaXRlbUluZGV4ID0gYXJyLmxlbmd0aCAtIDE7XG4gICAgfVxuICAgIGlmIChpdGVtSW5kZXggPj0gYXJyLmxlbmd0aCkge1xuICAgICAgICBpdGVtSW5kZXggPSAwO1xuICAgIH1cblxuICAgIHJldHVybiBpdGVtSW5kZXg7XG59XG5cbi8qKlxuICogQXBwZW5kIGhvdHNwb3RzIHRvIHNwaW5uZXIgc3RhZ2VcbiAqL1xuZnVuY3Rpb24gYXNzaWduSG90c3BvdHMoc3Bpbm5lckVsZW0pIHtcbiAgICBjb25zdCBzcGlubmVyTW9kdWxlID0gc3Bpbm5lckVsZW0uY2xvc2VzdCgnLm0taW1hZ2Utc3Bpbm5lcicpO1xuXG4gICAgaWYgKCFzcGlubmVyTW9kdWxlLmF0dHIoJ2RhdGEtc3Bpbm5lci1oYXMtaG90c3BvdHMnKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFzcGlubmVyTW9kdWxlLmF0dHIoJ2RhdGEtaG90c3BvdHMtZnJhbWVzJykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGhvdHNwb3RFbCA9IHNwaW5uZXJNb2R1bGUuZmluZCgnLmhvdHNwb3QnKTtcblxuICAgIGxldCBhcGkgPSBzcGlubmVyRWxlbS5zcHJpdGVzcGluKCdhcGknKTtcbiAgICBsZXQgZGF0YSA9IGFwaS5kYXRhO1xuXG4gICAgbGV0IGhvdHNwb3RzSFRNTCA9IHNwaW5uZXJNb2R1bGUuZmluZChcIi5ob3RzcG90XCIpO1xuXG4gICAgc3Bpbm5lckVsZW0uYmluZChcIm9uQ29tcGxldGUuc3ByaXRlc3BpblwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICBkYXRhID0gYXBpLmRhdGE7XG5cbiAgICAgICAgLy8gcHJlcGVuZCBhbGwgaG90c3BvdHMgb24gc3Bpbm5lciBpbml0XG4gICAgICAgIGRhdGEuc3RhZ2UucHJlcGVuZChob3RzcG90c0hUTUwpO1xuXG4gICAgICAgIC8vIGluaXRpYWxseSBzaG93IG9ubHkgdGhvc2UgaG90c3BvdHMgdGhhdCBleGlzdCBvbiBmaXJzdCBmcmFtZVxuICAgICAgICBkYXRhLnN0YWdlLmZpbmQoXCIuaG90c3BvdFwiKS5oaWRlKCk7XG4gICAgICAgIGRhdGEuc3RhZ2UuZmluZChcIi5ob3RzcG90LWZyYW1lLTBcIikuZmFkZUluKCk7XG5cbiAgICB9KS5iaW5kKFwib25BbmltYXRpb25TdG9wLnNwcml0ZXNwaW5cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIGdldCBkYXRhIGZvciBjdXJyZW50IHN0YXRlXG4gICAgICAgIGRhdGEgPSBhcGkuZGF0YTtcblxuICAgICAgICAvLyBzaG93IGhvdHNwb3RzIG9uIGN1cnJlbnQgZnJhbWVcbiAgICAgICAgaG90c3BvdEVsLmhpZGUoKTtcbiAgICAgICAgZGF0YS5zdGFnZS5maW5kKFwiLmhvdHNwb3QuaG90c3BvdC1mcmFtZS1cIiArIGRhdGEuZnJhbWUpLnN0b3AoZmFsc2UpLmZhZGVJbigpO1xuICAgIH0pO1xuXG4gICAgLy8gSGlkZSB0b29sdGlwIG9uIGNsb3NlIGJ0dG5cbiAgICBob3RzcG90RWwub24oJ2NsaWNrJywgJy5ob3RzcG90X190b29sdGlwLWNsb3NlJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBob3RzcG90RWwucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICBzcGlubmVyTW9kdWxlLmZpbmQoJy5qcy1ob3RzcG90cy1saXN0LWl0ZW0nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgfSk7XG5cbiAgICAvLyBIaWRlIHRvb2x0aXAgb24gaGl0dGluZyB0aGUgRXNjIGtleVxuICAgICQoZG9jdW1lbnQpLmtleXVwKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKDI3ID09PSBlLmtleUNvZGUpIHtcbiAgICAgICAgICAgIGhvdHNwb3RFbC5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICBzcGlubmVyTW9kdWxlLmZpbmQoJy5qcy1ob3RzcG90cy1saXN0LWl0ZW0nKS5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIEhpZGUgdG9vbHRpcCBvbiBjbGlja2luZyBvdXRzaWRlIG9mIGl0XG4gICAgJChkb2N1bWVudCkub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoKDAgPT09ICQoZS50YXJnZXQpLmNsb3Nlc3QoJCgnLmhvdHNwb3QnKSkubGVuZ3RoKSAmJiAoMCA9PT0gJChlLnRhcmdldCkuY2xvc2VzdCgkKCcuaG90c3BvdHMtY29udGVudCcpKS5sZW5ndGgpKSB7XG4gICAgICAgICAgICBob3RzcG90RWwucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICAgICAgc3Bpbm5lck1vZHVsZS5maW5kKCcuanMtaG90c3BvdHMtbGlzdC1pdGVtJykucmVtb3ZlQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cblxuLyoqXG4gKiBBZGQgaG90c3BvdHMgbmF2aWdhdGlvblxuICovXG5mdW5jdGlvbiBob3RzcG90c05hdihzcGlubmVyRWxlbSkge1xuICAgIGNvbnN0IHNwaW5uZXJNb2R1bGUgPSBzcGlubmVyRWxlbS5jbG9zZXN0KCcubS1pbWFnZS1zcGlubmVyJyk7XG4gICAgaWYgKCFzcGlubmVyTW9kdWxlLmF0dHIoJ2RhdGEtc3Bpbm5lci1oYXMtaG90c3BvdHMnKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghc3Bpbm5lck1vZHVsZS5hdHRyKCdkYXRhLWhvdHNwb3RzLWZyYW1lcycpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBoc19mcmFtZXNfbGlzdCA9IHNwaW5uZXJNb2R1bGUuYXR0cignZGF0YS1ob3RzcG90cy1mcmFtZXMnKTtcbiAgICBjb25zdCBoc19mcmFtZXMgPSBoc19mcmFtZXNfbGlzdC5zcGxpdCgnLCcpO1xuICAgIGNvbnN0IGhzQ29udGVudExpc3QgPSBzcGlubmVyTW9kdWxlLmZpbmQoJy5qcy1ob3RzcG90cy1saXN0Jyk7XG4gICAgY29uc3QgaHNDb250ZW50TGlzdEl0ZW0gPSBoc0NvbnRlbnRMaXN0LmZpbmQoJy5qcy1ob3RzcG90cy1saXN0LWl0ZW0nKTtcbiAgICBjb25zdCBob3RzcG90RWwgPSBzcGlubmVyTW9kdWxlLmZpbmQoJy5ob3RzcG90Jyk7XG5cbiAgICBsZXQgYXBpID0gc3Bpbm5lckVsZW0uc3ByaXRlc3BpbignYXBpJyk7XG4gICAgbGV0IGhvdHNwb3RzID0gW107XG4gICAgbGV0IGFjdGl2ZUZyYW1lSW5kZXggPSBhcGkuZGF0YS5mcmFtZTtcbiAgICBsZXQgYWN0aXZlSG90c3BvdCxcbiAgICAgICAgYWN0aXZlSG90c3BvdEluZGV4O1xuXG4gICAgaHNfZnJhbWVzLmZvckVhY2goZnVuY3Rpb24oaHMpIHtcbiAgICAgICAgaG90c3BvdHMucHVzaChwYXJzZUludChocykpO1xuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogU2V0IGFjdGl2ZSBob3RzcG90XG4gICAgICovXG4gICAgZnVuY3Rpb24gc2V0QWN0aXZlSG90c3BvdChhY3RpdmVIb3RzcG90SW5kZXgsIGRlYWN0aXZhdGVIb3RzcG90KSB7XG4gICAgICAgIC8vIGRlYWN0aXZhdGUgYWxsIGhvdHNwb3RzXG4gICAgICAgIGhvdHNwb3RFbC5yZW1vdmVDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgIGhzQ29udGVudExpc3RJdGVtLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcblxuICAgICAgICAvLyBpZiB0aGUgaG90c3BvdCBpcyBhbHJlYWR5IGFjdGl2ZSwgY2xvc2UgaXRcbiAgICAgICAgaWYgKGRlYWN0aXZhdGVIb3RzcG90KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBnZXQgdGhlIG5ldyBob3RzcG90IGFuZCBpdHMgZnJhbWVcbiAgICAgICAgYWN0aXZlSG90c3BvdCA9IGFwaS5kYXRhLnN0YWdlLmZpbmQoXCIuaG90c3BvdC5ob3RzcG90LWluZGV4LVwiICsgYWN0aXZlSG90c3BvdEluZGV4KTtcblxuICAgICAgICBhY3RpdmVGcmFtZUluZGV4ID0gaG90c3BvdHNbYWN0aXZlSG90c3BvdEluZGV4XTtcblxuICAgICAgICAvLyBpZiB0aGUgbmV3IGhvdHNwb3QgaXMgbm90IHRoZSBzYW1lIGZyYW1lLFxuICAgICAgICAvLyBoaWRlIGFsbCBob3RzcG90cyxcbiAgICAgICAgLy8gYW5kIG5hdmlnYXRlIHNwaW5uZXIgdG8gdGhlIGFjY29yZGluZyBvbmVcbiAgICAgICAgaWYgKGFjdGl2ZUZyYW1lSW5kZXggLSAxICE9PSBhcGkuZGF0YS5mcmFtZSkge1xuICAgICAgICAgICAgaG90c3BvdEVsLmhpZGUoKTtcbiAgICAgICAgICAgIGFwaS5wbGF5VG8oYWN0aXZlRnJhbWVJbmRleCAtIDEsIHsgbmVhcmVzdDogdHJ1ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFjdGl2YXRlIGN1cnJlbnQgaG90c3BvdCBhbmQgaXRzIGNvbnRlbnRcbiAgICAgICAgYWN0aXZlSG90c3BvdC5hZGRDbGFzcygnaXMtYWN0aXZlJyk7XG4gICAgICAgIGhzQ29udGVudExpc3QuZmluZCgnLmhzLWluZGV4LScgKyBhY3RpdmVIb3RzcG90SW5kZXgpLmFkZENsYXNzKCdpcy1hY3RpdmUnKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIE5hdmlnYXRlIHRocm91Z2ggaG90c3BvdHMnIHBpbnNcbiAgICAgKi9cbiAgICBBcnJheS5mcm9tKGhvdHNwb3RFbCkuZm9yRWFjaChocyA9PiB7XG4gICAgICAgICQoaHMpLm9uKCdjbGljaycsICcuanMtaG90c3BvdC1waW4nLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBhY3RpdmVIb3RzcG90SW5kZXggPSAkKGhzKS5hdHRyKCdkYXRhLWhvdHNwb3QtaW5kZXgnKTtcbiAgICAgICAgICAgIGFjdGl2ZUhvdHNwb3RJbmRleCA9IHBhcnNlSW50KGFjdGl2ZUhvdHNwb3RJbmRleCk7XG5cbiAgICAgICAgICAgIGxldCBkZWFjdGl2YXRlSG90c3BvdCA9ICQoaHMpLmhhc0NsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgIHNldEFjdGl2ZUhvdHNwb3QoYWN0aXZlSG90c3BvdEluZGV4LCBkZWFjdGl2YXRlSG90c3BvdCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG5cbiAgICAvKipcbiAgICAgKiBOYXZpZ2F0ZSB0aHJvdWdoIGhvdHNwb3RzJyBjb250ZW50XG4gICAgICovXG4gICAgQXJyYXkuZnJvbShoc0NvbnRlbnRMaXN0SXRlbSkuZm9yRWFjaChkZXQgPT4ge1xuICAgICAgICAkKGRldCkub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgYWN0aXZlSG90c3BvdEluZGV4ID0gJCh0aGlzKS5hdHRyKCdkYXRhLWhzLWluZGV4Jyk7XG4gICAgICAgICAgICBhY3RpdmVIb3RzcG90SW5kZXggPSBwYXJzZUludChhY3RpdmVIb3RzcG90SW5kZXgpO1xuXG4gICAgICAgICAgICBsZXQgZGVhY3RpdmF0ZUhvdHNwb3QgPSAkKHRoaXMpLmhhc0NsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgIHNldEFjdGl2ZUhvdHNwb3QoYWN0aXZlSG90c3BvdEluZGV4LCBkZWFjdGl2YXRlSG90c3BvdCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG5cbiAgICAvKipcbiAgICAgKiBQcmV2L05leHQgbmF2aWdhdGlvblxuICAgICAqL1xuICAgIGlmIChzcGlubmVyTW9kdWxlLmF0dHIoJ2RhdGEtY3RybC1ob3RzcG90cy1uYXYnKSkge1xuICAgICAgICBjb25zdCBjdHJsQnR0blByZXZIb3RzcG90ID0gc3Bpbm5lck1vZHVsZS5maW5kKCcuanMtaW1hZ2Utc3Bpbm5lci1ob3RzcG90LXByZXYnKTtcbiAgICAgICAgY29uc3QgY3RybEJ0dG5OZXh0SG90c3BvdCA9IHNwaW5uZXJNb2R1bGUuZmluZCgnLmpzLWltYWdlLXNwaW5uZXItaG90c3BvdC1uZXh0Jyk7XG5cbiAgICAgICAgYWN0aXZlRnJhbWVJbmRleCA9IGFwaS5kYXRhLmZyYW1lO1xuXG4gICAgICAgIGN0cmxCdHRuUHJldkhvdHNwb3Qub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgYWN0aXZlSG90c3BvdCA9IGFwaS5kYXRhLnN0YWdlLmZpbmQoXCIuaG90c3BvdC5pcy1hY3RpdmVcIik7XG5cbiAgICAgICAgICAgIGlmICgwIDwgYWN0aXZlSG90c3BvdC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBhY3RpdmVIb3RzcG90SW5kZXggPSBhY3RpdmVIb3RzcG90LmF0dHIoJ2RhdGEtaG90c3BvdC1pbmRleCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBhY3RpdmVIb3RzcG90SW5kZXggPSAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhY3RpdmVIb3RzcG90SW5kZXggPSBwYXJzZUludChhY3RpdmVIb3RzcG90SW5kZXgpO1xuICAgICAgICAgICAgYWN0aXZlSG90c3BvdEluZGV4LS07XG4gICAgICAgICAgICBhY3RpdmVIb3RzcG90SW5kZXggPSBub3JtYWxpemVJdGVtSW5kZXgoYWN0aXZlSG90c3BvdEluZGV4LCBob3RzcG90cyk7XG5cbiAgICAgICAgICAgIHNldEFjdGl2ZUhvdHNwb3QoYWN0aXZlSG90c3BvdEluZGV4KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY3RybEJ0dG5OZXh0SG90c3BvdC5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBhY3RpdmVIb3RzcG90ID0gYXBpLmRhdGEuc3RhZ2UuZmluZChcIi5ob3RzcG90LmlzLWFjdGl2ZVwiKTtcblxuICAgICAgICAgICAgaWYgKDAgPCBhY3RpdmVIb3RzcG90Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGFjdGl2ZUhvdHNwb3RJbmRleCA9IGFjdGl2ZUhvdHNwb3QuYXR0cignZGF0YS1ob3RzcG90LWluZGV4Jyk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYWN0aXZlSG90c3BvdEluZGV4ID0gaG90c3BvdHMubGVuZ3RoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhY3RpdmVIb3RzcG90SW5kZXggPSBwYXJzZUludChhY3RpdmVIb3RzcG90SW5kZXgpO1xuICAgICAgICAgICAgYWN0aXZlSG90c3BvdEluZGV4Kys7XG4gICAgICAgICAgICBhY3RpdmVIb3RzcG90SW5kZXggPSBub3JtYWxpemVJdGVtSW5kZXgoYWN0aXZlSG90c3BvdEluZGV4LCBob3RzcG90cyk7XG5cbiAgICAgICAgICAgIHNldEFjdGl2ZUhvdHNwb3QoYWN0aXZlSG90c3BvdEluZGV4KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4vKlxuZnVuY3Rpb24gZ2V0T2JqS2V5KG9iaiwgdmFsdWUpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqKS5maW5kKGtleSA9PiBvYmpba2V5XSA9PT0gdmFsdWUpO1xufVxuKi9cblxuY29uc3QgcmVnaXN0ZXJIb3RTcG90c1BsdWdpbiA9IChsYWJlbCkgPT4ge1xuICAgIFNwcml0ZVNwaW4ucmVnaXN0ZXJQbHVnaW4obGFiZWwsIHtcbiAgICAgICAgb25Mb2FkOiAoZXYpID0+IHtcbiAgICAgICAgICAgIGFzc2lnbkhvdHNwb3RzKCQoZXYudGFyZ2V0KSk7XG4gICAgICAgICAgICBob3RzcG90c05hdigkKGV2LnRhcmdldCkpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cblxuZXhwb3J0IHtcbiAgICByZWdpc3RlckhvdFNwb3RzUGx1Z2luXG59IiwiLyoqXG4gKiBJbWFnZSBTcGlubmVyIFBsdWdpbiAtIGRzUHJvZ3Jlc3NGcmFjdGlvblxuICovXG5cbmZ1bmN0aW9uIHByb2dyZXNzRnJhY3Rpb24oc3Bpbm5lckVsZW0pIHtcbiAgICBsZXQgYXBpID0gc3Bpbm5lckVsZW0uc3ByaXRlc3BpbignYXBpJyk7XG4gICAgY29uc3Qgc3Bpbm5lck1vZHVsZSA9IHNwaW5uZXJFbGVtLmNsb3Nlc3QoJy5tLWltYWdlLXNwaW5uZXInKTtcbiAgICBjb25zdCBzcGlubmVyRnJhY3Rpb24gPSBzcGlubmVyTW9kdWxlLmZpbmQoJy5pbWFnZS1zcGlubmVyX19mcmFjdGlvbi1jdXJyZW50Jyk7XG4gICAgbGV0IGRhdGEgPSBhcGkuZGF0YTtcblxuICAgIHNwaW5uZXJFbGVtLmJpbmQoXCJvbkZyYW1lLnNwcml0ZXNwaW5cIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGRhdGEgPSBhcGkuZGF0YTtcbiAgICAgICAgc3Bpbm5lckZyYWN0aW9uLnRleHQoZGF0YS5mcmFtZSArIDEpO1xuICAgIH0pO1xufVxuXG5jb25zdCByZWdpc3RlclByb2dyZXNzRnJhY3Rpb25QbHVnaW4gPSAobGFiZWwpID0+IHtcbiAgICBTcHJpdGVTcGluLnJlZ2lzdGVyUGx1Z2luKGxhYmVsLCB7XG4gICAgICAgIG9uTG9hZDogKGV2KSA9PiB7XG4gICAgICAgICAgICBwcm9ncmVzc0ZyYWN0aW9uKCQoZXYudGFyZ2V0KSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuXG5leHBvcnQge1xuICAgIHJlZ2lzdGVyUHJvZ3Jlc3NGcmFjdGlvblBsdWdpblxufSIsIi8qKlxuICogaHR0cHM6Ly9naXRodWIuY29tL2phbnJlbWJvbGQvZXM2LWVhc2luZ3NcbiAqXG4gKiB1c2FnZSA6IGltcG9ydCB7ZWFzZUluT3V0UXVhZH0gZnJvbSAnZWFzaW5ncyc7XG4gKi9cblxuZXhwb3J0IGNvbnN0IGVhc2VPdXRRdWFkID0gKHQsIGIsIGMsIGQpID0+IHtcbiAgICByZXR1cm4gLWMgKiAodCAvPSBkKSAqICh0IC0gMikgKyBiO1xufTtcbmV4cG9ydCBjb25zdCBlYXNlSW5RdWFkID0gKHQsIGIsIGMsIGQpID0+IHtcbiAgICByZXR1cm4gYyAqICh0IC89IGQpICogdCArIGI7XG59O1xuZXhwb3J0IGNvbnN0IGVhc2VJbk91dFF1YWQgPSAodCwgYiwgYywgZCkgPT4ge1xuICAgIGlmICgodCAvPSBkIC8gMikgPCAxKVxuICAgICAgICByZXR1cm4gYyAvIDIgKiB0ICogdCArIGI7XG4gICAgcmV0dXJuIC1jIC8gMiAqICgoLS10KSAqICh0IC0gMikgLSAxKSArIGI7XG59O1xuZXhwb3J0IGNvbnN0IGVhc2VJbkN1YmljID0gKHQsIGIsIGMsIGQpID0+IHtcbiAgICByZXR1cm4gYyAqICh0IC89IGQpICogdCAqIHQgKyBiO1xufTtcbmV4cG9ydCBjb25zdCBlYXNlT3V0Q3ViaWMgPSAodCwgYiwgYywgZCkgPT4ge1xuICAgIHJldHVybiBjICogKCh0ID0gdCAvIGQgLSAxKSAqIHQgKiB0ICsgMSkgKyBiO1xufTtcbmV4cG9ydCBjb25zdCBlYXNlSW5PdXRDdWJpYyA9ICh0LCBiLCBjLCBkKSA9PiB7XG4gICAgaWYgKCh0IC89IGQgLyAyKSA8IDEpXG4gICAgICAgIHJldHVybiBjIC8gMiAqIHQgKiB0ICogdCArIGI7XG4gICAgcmV0dXJuIGMgLyAyICogKCh0IC09IDIpICogdCAqIHQgKyAyKSArIGI7XG59O1xuZXhwb3J0IGNvbnN0IGVhc2VJblF1YXJ0ID0gKHQsIGIsIGMsIGQpID0+IHtcbiAgICByZXR1cm4gYyAqICh0IC89IGQpICogdCAqIHQgKiB0ICsgYjtcbn07XG5leHBvcnQgY29uc3QgZWFzZU91dFF1YXJ0ID0gKHQsIGIsIGMsIGQpID0+IHtcbiAgICByZXR1cm4gLWMgKiAoKHQgPSB0IC8gZCAtIDEpICogdCAqIHQgKiB0IC0gMSkgKyBiO1xufTtcbmV4cG9ydCBjb25zdCBlYXNlSW5PdXRRdWFydCA9ICh0LCBiLCBjLCBkKSA9PiB7XG4gICAgaWYgKCh0IC89IGQgLyAyKSA8IDEpXG4gICAgICAgIHJldHVybiBjIC8gMiAqIHQgKiB0ICogdCAqIHQgKyBiO1xuICAgIHJldHVybiAtYyAvIDIgKiAoKHQgLT0gMikgKiB0ICogdCAqIHQgLSAyKSArIGI7XG59O1xuZXhwb3J0IGNvbnN0IGVhc2VJblF1aW50ID0gKHQsIGIsIGMsIGQpID0+IHtcbiAgICByZXR1cm4gYyAqICh0IC89IGQpICogdCAqIHQgKiB0ICogdCArIGI7XG59O1xuZXhwb3J0IGNvbnN0IGVhc2VPdXRRdWludCA9ICh0LCBiLCBjLCBkKSA9PiB7XG4gICAgcmV0dXJuIGMgKiAoKHQgPSB0IC8gZCAtIDEpICogdCAqIHQgKiB0ICogdCArIDEpICsgYjtcbn07XG5leHBvcnQgY29uc3QgZWFzZUluT3V0UXVpbnQgPSAodCwgYiwgYywgZCkgPT4ge1xuICAgIGlmICgodCAvPSBkIC8gMikgPCAxKVxuICAgICAgICByZXR1cm4gYyAvIDIgKiB0ICogdCAqIHQgKiB0ICogdCArIGI7XG4gICAgcmV0dXJuIGMgLyAyICogKCh0IC09IDIpICogdCAqIHQgKiB0ICogdCArIDIpICsgYjtcbn07XG5leHBvcnQgY29uc3QgZWFzZUluU2luZSA9ICh0LCBiLCBjLCBkKSA9PiB7XG4gICAgcmV0dXJuIC1jICogTWF0aC5jb3ModCAvIGQgKiAoTWF0aC5QSSAvIDIpKSArIGMgKyBiO1xufTtcbmV4cG9ydCBjb25zdCBlYXNlT3V0U2luZSA9ICh0LCBiLCBjLCBkKSA9PiB7XG4gICAgcmV0dXJuIGMgKiBNYXRoLnNpbih0IC8gZCAqIChNYXRoLlBJIC8gMikpICsgYjtcbn07XG5leHBvcnQgY29uc3QgZWFzZUluT3V0U2luZSA9ICh0LCBiLCBjLCBkKSA9PiB7XG4gICAgcmV0dXJuIC1jIC8gMiAqIChNYXRoLmNvcyhNYXRoLlBJICogdCAvIGQpIC0gMSkgKyBiO1xufTtcbmV4cG9ydCBjb25zdCBlYXNlSW5FeHBvID0gKHQsIGIsIGMsIGQpID0+IHtcbiAgICByZXR1cm4gKHQgPT0gMCkgPyBiIDogYyAqIE1hdGgucG93KDIsIDEwICogKHQgLyBkIC0gMSkpICsgYjtcbn07XG5leHBvcnQgY29uc3QgZWFzZU91dEV4cG8gPSAodCwgYiwgYywgZCkgPT4ge1xuICAgIHJldHVybiAodCA9PSBkKSA/IGIgKyBjIDogYyAqICgtTWF0aC5wb3coMiwgLTEwICogdCAvIGQpICsgMSkgKyBiO1xufTtcbmV4cG9ydCBjb25zdCBlYXNlSW5PdXRFeHBvID0gKHQsIGIsIGMsIGQpID0+IHtcbiAgICBpZiAodCA9PSAwKVxuICAgICAgICByZXR1cm4gYjtcbiAgICBpZiAodCA9PSBkKVxuICAgICAgICByZXR1cm4gYiArIGM7XG4gICAgaWYgKCh0IC89IGQgLyAyKSA8IDEpXG4gICAgICAgIHJldHVybiBjIC8gMiAqIE1hdGgucG93KDIsIDEwICogKHQgLSAxKSkgKyBiO1xuICAgIHJldHVybiBjIC8gMiAqICgtTWF0aC5wb3coMiwgLTEwICogLS10KSArIDIpICsgYjtcbn07XG5leHBvcnQgY29uc3QgZWFzZUluQ2lyYyA9ICh0LCBiLCBjLCBkKSA9PiB7XG4gICAgcmV0dXJuIC1jICogKE1hdGguc3FydCgxIC0gKHQgLz0gZCkgKiB0KSAtIDEpICsgYjtcbn07XG5leHBvcnQgY29uc3QgZWFzZU91dENpcmMgPSAodCwgYiwgYywgZCkgPT4ge1xuICAgIHJldHVybiBjICogTWF0aC5zcXJ0KDEgLSAodCA9IHQgLyBkIC0gMSkgKiB0KSArIGI7XG59O1xuZXhwb3J0IGNvbnN0IGVhc2VJbk91dENpcmMgPSAodCwgYiwgYywgZCkgPT4ge1xuICAgIGlmICgodCAvPSBkIC8gMikgPCAxKVxuICAgICAgICByZXR1cm4gLWMgLyAyICogKE1hdGguc3FydCgxIC0gdCAqIHQpIC0gMSkgKyBiO1xuICAgIHJldHVybiBjIC8gMiAqIChNYXRoLnNxcnQoMSAtICh0IC09IDIpICogdCkgKyAxKSArIGI7XG59O1xuZXhwb3J0IGNvbnN0IGVhc2VJbkVsYXN0aWMgPSAodCwgYiwgYywgZCkgPT4ge1xuICAgIHZhciBzID0gMS43MDE1ODtcbiAgICB2YXIgcCA9IDA7XG4gICAgdmFyIGEgPSBjO1xuICAgIGlmICh0ID09IDApXG4gICAgICAgIHJldHVybiBiO1xuICAgIGlmICgodCAvPSBkKSA9PSAxKVxuICAgICAgICByZXR1cm4gYiArIGM7XG4gICAgaWYgKCFwKVxuICAgICAgICBwID0gZCAqIC4zO1xuICAgIGlmIChhIDwgTWF0aC5hYnMoYykpIHtcbiAgICAgICAgYSA9IGM7XG4gICAgICAgIHZhciBzID0gcCAvIDQ7XG4gICAgfVxuICAgIGVsc2VcbiAgICAgICAgdmFyIHMgPSBwIC8gKDIgKiBNYXRoLlBJKSAqIE1hdGguYXNpbihjIC8gYSk7XG4gICAgcmV0dXJuIC0oYSAqIE1hdGgucG93KDIsIDEwICogKHQgLT0gMSkpICogTWF0aC5zaW4oKHQgKiBkIC0gcykgKiAoMiAqIE1hdGguUEkpIC8gcCkpICsgYjtcbn07XG5leHBvcnQgY29uc3QgZWFzZU91dEVsYXN0aWMgPSAodCwgYiwgYywgZCkgPT4ge1xuICAgIHZhciBzID0gMS43MDE1ODtcbiAgICB2YXIgcCA9IDA7XG4gICAgdmFyIGEgPSBjO1xuICAgIGlmICh0ID09IDApXG4gICAgICAgIHJldHVybiBiO1xuICAgIGlmICgodCAvPSBkKSA9PSAxKVxuICAgICAgICByZXR1cm4gYiArIGM7XG4gICAgaWYgKCFwKVxuICAgICAgICBwID0gZCAqIC4zO1xuICAgIGlmIChhIDwgTWF0aC5hYnMoYykpIHtcbiAgICAgICAgYSA9IGM7XG4gICAgICAgIHZhciBzID0gcCAvIDQ7XG4gICAgfVxuICAgIGVsc2VcbiAgICAgICAgdmFyIHMgPSBwIC8gKDIgKiBNYXRoLlBJKSAqIE1hdGguYXNpbihjIC8gYSk7XG4gICAgcmV0dXJuIGEgKiBNYXRoLnBvdygyLCAtMTAgKiB0KSAqIE1hdGguc2luKCh0ICogZCAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApICsgYyArIGI7XG59O1xuZXhwb3J0IGNvbnN0IGVhc2VJbk91dEVsYXN0aWMgPSAodCwgYiwgYywgZCkgPT4ge1xuICAgIHZhciBzID0gMS43MDE1ODtcbiAgICB2YXIgcCA9IDA7XG4gICAgdmFyIGEgPSBjO1xuICAgIGlmICh0ID09IDApXG4gICAgICAgIHJldHVybiBiO1xuICAgIGlmICgodCAvPSBkIC8gMikgPT0gMilcbiAgICAgICAgcmV0dXJuIGIgKyBjO1xuICAgIGlmICghcClcbiAgICAgICAgcCA9IGQgKiAoLjMgKiAxLjUpO1xuICAgIGlmIChhIDwgTWF0aC5hYnMoYykpIHtcbiAgICAgICAgYSA9IGM7XG4gICAgICAgIHZhciBzID0gcCAvIDQ7XG4gICAgfVxuICAgIGVsc2VcbiAgICAgICAgdmFyIHMgPSBwIC8gKDIgKiBNYXRoLlBJKSAqIE1hdGguYXNpbihjIC8gYSk7XG4gICAgaWYgKHQgPCAxKVxuICAgICAgICByZXR1cm4gLS41ICogKGEgKiBNYXRoLnBvdygyLCAxMCAqICh0IC09IDEpKSAqIE1hdGguc2luKCh0ICogZCAtIHMpICogKDIgKiBNYXRoLlBJKSAvIHApKSArIGI7XG4gICAgcmV0dXJuIGEgKiBNYXRoLnBvdygyLCAtMTAgKiAodCAtPSAxKSkgKiBNYXRoLnNpbigodCAqIGQgLSBzKSAqICgyICogTWF0aC5QSSkgLyBwKSAqIC41ICsgYyArIGI7XG59O1xuZXhwb3J0IGNvbnN0IGVhc2VJbkJhY2sgPSAodCwgYiwgYywgZCwgcyA9IDEuNzAxNTgpID0+IHtcbiAgICByZXR1cm4gYyAqICh0IC89IGQpICogdCAqICgocyArIDEpICogdCAtIHMpICsgYjtcbn07XG5leHBvcnQgY29uc3QgZWFzZU91dEJhY2sgPSAodCwgYiwgYywgZCwgcyA9IDEuNzAxNTgpID0+IHtcbiAgICByZXR1cm4gYyAqICgodCA9IHQgLyBkIC0gMSkgKiB0ICogKChzICsgMSkgKiB0ICsgcykgKyAxKSArIGI7XG59O1xuZXhwb3J0IGNvbnN0IGVhc2VJbk91dEJhY2sgPSAodCwgYiwgYywgZCwgcyA9IDEuNzAxNTgpID0+IHtcbiAgICBpZiAoKHQgLz0gZCAvIDIpIDwgMSlcbiAgICAgICAgcmV0dXJuIGMgLyAyICogKHQgKiB0ICogKCgocyAqPSAoMS41MjUpKSArIDEpICogdCAtIHMpKSArIGI7XG4gICAgcmV0dXJuIGMgLyAyICogKCh0IC09IDIpICogdCAqICgoKHMgKj0gKDEuNTI1KSkgKyAxKSAqIHQgKyBzKSArIDIpICsgYjtcbn07XG5leHBvcnQgY29uc3QgZWFzZUluQm91bmNlID0gKHQsIGIsIGMsIGQpID0+IHtcbiAgICByZXR1cm4gYyAtIGVhc2VPdXRCb3VuY2UoZCAtIHQsIDAsIGMsIGQpICsgYjtcbn07XG5leHBvcnQgY29uc3QgZWFzZU91dEJvdW5jZSA9ICh0LCBiLCBjLCBkKSA9PiB7XG4gICAgaWYgKCh0IC89IGQpIDwgKDEgLyAyLjc1KSkge1xuICAgICAgICByZXR1cm4gYyAqICg3LjU2MjUgKiB0ICogdCkgKyBiO1xuICAgIH1cbiAgICBlbHNlIGlmICh0IDwgKDIgLyAyLjc1KSkge1xuICAgICAgICByZXR1cm4gYyAqICg3LjU2MjUgKiAodCAtPSAoMS41IC8gMi43NSkpICogdCArIC43NSkgKyBiO1xuICAgIH1cbiAgICBlbHNlIGlmICh0IDwgKDIuNSAvIDIuNzUpKSB7XG4gICAgICAgIHJldHVybiBjICogKDcuNTYyNSAqICh0IC09ICgyLjI1IC8gMi43NSkpICogdCArIC45Mzc1KSArIGI7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gYyAqICg3LjU2MjUgKiAodCAtPSAoMi42MjUgLyAyLjc1KSkgKiB0ICsgLjk4NDM3NSkgKyBiO1xuICAgIH1cbn07XG5leHBvcnQgY29uc3QgZWFzZUluT3V0Qm91bmNlID0gKHQsIGIsIGMsIGQpID0+IHtcbiAgICBpZiAodCA8IGQgLyAyKVxuICAgICAgICByZXR1cm4gZWFzZUluQm91bmNlKHQgKiAyLCAwLCBjLCBkKSAqIC41ICsgYjtcbiAgICByZXR1cm4gZWFzZU91dEJvdW5jZSh0ICogMiAtIGQsIDAsIGMsIGQpICogLjUgKyBjICogLjUgKyBiO1xufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcCIsIi8qKlxuICogVE9ETzogcmV3b3JrIGl0IHRvIHVzZSByZXF1ZXN0IGFuaW1hdGlvbiBmcmFtZVxuICogaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjE0NzQ2Nzgvc2Nyb2xsdG9wLWFuaW1hdGlvbi13aXRob3V0LWpxdWVyeVxuICpcbiAqIHRha2VuIGZyb21cbiAqIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL2FuZGpvc2gvNjc2NDkzOVxuICogaHR0cHM6Ly9naXRodWIuY29tL2FsdmFyb3RyaWdvL3Nrcm9sbFRvcC5qcy9ibG9iL21hc3Rlci9za3JvbGxUb3AuanNcbiAqXG4gKi9cbk1hdGguZWFzZUluT3V0Q3ViaWMgPSBmdW5jdGlvbiAodCwgYiwgYywgZCkge1xuICAgIGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqdCp0KnQgKyBiO3JldHVybiBjLzIqKCh0LT0yKSp0KnQgKyAyKSArIGI7XG59O1xuXG5leHBvcnQgY29uc3Qgc2Nyb2xsVG9VdGlsID0gKHBhcmFtcykgPT4ge1xuICAgIGxldCBlbGVtZW50ID0gdHlwZW9mIHBhcmFtcy5lbGVtZW50ICE9PSAndW5kZWZpbmVkJyA/IHBhcmFtcy5lbGVtZW50IDogd2luZG93O1xuICAgIGxldCB0byA9IHBhcmFtcy50bztcbiAgICBsZXQgZHVyYXRpb24gPSB0eXBlb2YgcGFyYW1zLmR1cmF0aW9uICE9PSAndW5kZWZpbmVkJyA/IHBhcmFtcy5kdXJhdGlvbiA6IDI1MDtcbiAgICBsZXQgY2FsbGJhY2sgPSB0eXBlb2YgcGFyYW1zLmNhbGxiYWNrICE9PSAndW5kZWZpbmVkJyA/IHBhcmFtcy5jYWxsYmFjayA6IG51bGw7XG4gICAgbGV0IGVhc2luZyA9IHR5cGVvZiBwYXJhbXMuZWFzaW5nICE9PSAndW5kZWZpbmVkJyA/IHBhcmFtcy5lYXNpbmcgOiBNYXRoLmVhc2VJbk91dEN1YmljO1xuXG4gICAgbGV0IHN0YXJ0ID0gZWxlbWVudCE9PXdpbmRvdyA/IGVsZW1lbnQuc2Nyb2xsVG9wIDogKHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wKSAgLSAoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFRvcCB8fCAwKTtcbiAgICBsZXQgY2hhbmdlID0gdG8gLSBzdGFydDtcbiAgICBsZXQgY3VycmVudFRpbWUgPSAwO1xuICAgIGxldCBpbmNyZW1lbnQgPSAxNjsgLy9zYW1lIGFtb3VudCBvZiBtaWxsaXNlY29uZHMgYXMgcmVxdWVzdEFuaW1hdGlvbkZyYW1lXG5cbiAgICBjb25zdCBhbmltYXRlU2Nyb2xsID0gKCkgPT4ge1xuXG4gICAgICAgIGN1cnJlbnRUaW1lICs9IGluY3JlbWVudDtcbiAgICAgICAgdmFyIGVhc2luZ1ZhbHVlID0gZHVyYXRpb24gPyBlYXNpbmcoY3VycmVudFRpbWUsIHN0YXJ0LCBjaGFuZ2UsIGR1cmF0aW9uKSA6IHRvO1xuICAgICAgICBlbGVtZW50LnNjcm9sbFRvKDAsIGVhc2luZ1ZhbHVlKTtcblxuICAgICAgICBpZiAoY3VycmVudFRpbWUgPCBkdXJhdGlvbikge1xuICAgICAgICAgICAgc2V0VGltZW91dChhbmltYXRlU2Nyb2xsLCBpbmNyZW1lbnQpO1xuICAgICAgICB9IGVsc2UgaWYgKGNhbGxiYWNrKXtcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgYW5pbWF0ZVNjcm9sbCgpO1xufTtcbiIsIi8qKlxuICogQ29sbGFwc2VcbiAqXG4gKiBodHRwczovL21lZGl1bS5jb20vZGFpbHlqcy9taW1pY2tpbmctYm9vdHN0cmFwcy1jb2xsYXBzZS13aXRoLXZhbmlsbGEtamF2YXNjcmlwdC1iM2JiMzg5MDQwZTdcbiAqL1xuXG5jb25zdCBkc19jb2xsYXBzZSA9ICgpID0+IHtcbiAgICAvLyBIYW5kbGVyIHRoYXQgdXNlcyB2YXJpb3VzIGRhdGEtKiBhdHRyaWJ1dGVzIHRvIHRyaWdnZXJcbiAgICAvLyBzcGVjaWZpYyBhY3Rpb25zLCBtaW1pY2luZyBib290c3RyYXBzIGF0dHJpYnV0ZXNcbiAgICBjb25zdCB0cmlnZ2VycyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdG9nZ2xlPVwiY29sbGFwc2VcIl0nKSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgaWYgKHRyaWdnZXJzLmluY2x1ZGVzKGVsZW1lbnQpKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgY29uc3Qgc2VsZWN0b3IgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10YXJnZXQnKTtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdG9yVGV4dENsb3NlZCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLXRleHQtY2xvc2VkJyk7XG4gICAgICAgICAgICBjb25zdCBzZWxlY3RvclRleHRPcGVuZWQgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS10ZXh0LW9wZW5lZCcpO1xuICAgICAgICAgICAgY29sbGFwc2Uoc2VsZWN0b3IsICd0b2dnbGUnKTtcbiAgICAgICAgICAgIGlmIChldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdjb2xsYXBzZS10cmlnZ2VyLS1vcGVuZWQnKSkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdjb2xsYXBzZS10cmlnZ2VyLS1vcGVuZWQnKTtcbiAgICAgICAgICAgICAgICBldmVudC50YXJnZXQuaW5uZXJIVE1MID0gc2VsZWN0b3JUZXh0Q2xvc2VkO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBldmVudC50YXJnZXQuY2xhc3NMaXN0LmFkZCgnY29sbGFwc2UtdHJpZ2dlci0tb3BlbmVkJyk7XG4gICAgICAgICAgICAgICAgZXZlbnQudGFyZ2V0LmlubmVySFRNTCA9IHNlbGVjdG9yVGV4dE9wZW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sIGZhbHNlKTtcblxuICAgIGNvbnN0IGZubWFwID0ge1xuICAgICAgICB0b2dnbGU6ICd0b2dnbGUnLFxuICAgICAgICBzaG93OiAnYWRkJyxcbiAgICAgICAgaGlkZTogJ3JlbW92ZScsXG4gICAgfTtcblxuICAgIGNvbnN0IGNvbGxhcHNlID0gKHNlbGVjdG9yLCBjbWQpID0+IHtcbiAgICAgICAgY29uc3QgdGFyZ2V0cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpO1xuICAgICAgICB0YXJnZXRzLmZvckVhY2goKHRhcmdldCkgPT4ge1xuICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdFtmbm1hcFtjbWRdXSgnaXMtc2hvdycpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG59O1xuXG5leHBvcnQge1xuICAgIGRzX2NvbGxhcHNlLFxufTtcbiIsImNvbnN0IGRzX2dyaWRkZXJJbml0ID0gKCkgPT4ge1xuXG4gICAgY29uc3QgZ3JpZGRlckVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmpzLWdyaWRkZXInKTtcblxuICAgIGlmIChncmlkZGVyRWxlbWVudHMpIHtcblxuICAgICAgICBncmlkZGVyRWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuXG4gICAgICAgICAgICBjb25zdCBjb2x1bW5zID0gTnVtYmVyKGVsZW1lbnQuZGF0YXNldC5ncmlkZGVyQ29sdW1ucykgfHwgMzsgLy8gc2V0IGRlZmF1bHQgdG8gM1xuICAgICAgICAgICAgY29uc3QgZ2FwID0gTnVtYmVyKGVsZW1lbnQuZGF0YXNldC5ncmlkZGVyR2FwKSB8fCAxNTsgLy8gc2V0IGRlZmF1bHQgdG8gMTVcblxuICAgICAgICAgICAgbmV3IEdyaWRkZXJKUyhlbGVtZW50LCB7IGNvbHVtbnMsIGdhcCB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblxuZXhwb3J0IHtcbiAgICBkc19ncmlkZGVySW5pdCxcbn07XG4iLCIvKipcbiAqIFRvZ2dsZSBlbGVtZW50IG9uIGNsaWNrXG4gKlxuICogaHR0cHM6Ly9nb21ha2V0aGluZ3MuY29tL2hvdy10by1zaG93LWFuZC1oaWRlLWVsZW1lbnRzLXdpdGgtdmFuaWxsYS1qYXZhc2NyaXB0L1xuICovXG5pbXBvcnQgeyB1X3RvZ2dsZUVsZW0gfSBmcm9tICcuLi8uLi91dGlscy91X3Nob3ctaGlkZS1kaXNwbGF5JztcblxuY29uc3QgZHNfdG9nZ2xlRWxlbWVudCA9ICgpID0+IHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG4gICAgICAgIGlmIChlLnRhcmdldC5tYXRjaGVzKCdbZGF0YS1qcz1cInRvZ2dsZS1lbGVtZW50XCJdJykpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgLy8gR2V0IHRoZSBjb250ZW50XG4gICAgICAgICAgICBjb25zdCBjb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihlLnRhcmdldC5oYXNoKTtcbiAgICAgICAgICAgIGlmICghY29udGVudCkgcmV0dXJuO1xuXG4gICAgICAgICAgICAvLyBUb2dnbGUgdGhlIGNvbnRlbnRcbiAgICAgICAgICAgIHVfdG9nZ2xlRWxlbShjb250ZW50KTtcblxuICAgICAgICB9XG5cbiAgICB9LCBmYWxzZSk7XG59O1xuXG5leHBvcnQge1xuICAgIGRzX3RvZ2dsZUVsZW1lbnQsXG59O1xuIiwiLyoqXG4gKiBEUyBQcm9ncmVzcyBDb3VudGVyICAxLjAuMFxuICpcbiAqIFdyaXR0ZW4gb246IE1hcmNoIDAyLCAyMDIyXG4gKlxuICovXG5cbmNsYXNzIFByb2dyZXNzQ2lyY2xlQ291bnRlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBzZWxlY3RvcjogJy5jLWNvdW50ZXJfX3Byb2dyZXNzJyxcbiAgICAgICAgICAgIGl0ZW06IHtcbiAgICAgICAgICAgICAgICBzdmc6ICcuYy1jb3VudGVyX19jaXJjbGUnLFxuICAgICAgICAgICAgICAgIHRleHQ6ICcuYy1jb3VudGVyX190ZXh0JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdmdDbGFzc2VzOiB7XG4gICAgICAgICAgICAgICAgY29tcGxldGU6ICcuY29tcGxldGUnLFxuICAgICAgICAgICAgICAgIGluY29tcGxldGU6ICcuaW5jb21wbGV0ZScsXG4gICAgICAgICAgICAgICAgcGVyY2VudGFnZTogJy5wZXJjZW50YWdlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkdXJhdGlvbjogMjAwMCxcbiAgICAgICAgICAgIGRlbGF5OiAxMCxcbiAgICAgICAgICAgIG9uY2U6IHRydWUsXG4gICAgICAgICAgICBzdGFydDogMCxcbiAgICAgICAgICAgIHBlcmNlbnRhZ2U6IDUwLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHBlcmNlbnRhZ2U6ICdkYXRhLXByb2dyZXNzLXBlcmNlbnRhZ2UnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmNvbmZpZ09wdGlvbnMgPSB7IC4uLnRoaXMuZGVmYXVsdHMsIC4uLm9wdGlvbnMgfHwge30gfTtcbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50TGlzdGVuZXJzKCk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJFdmVudExpc3RlbmVycygpIHtcbiAgICAgICAgY29uc3QgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuY29uZmlnT3B0aW9ucy5zZWxlY3Rvcik7XG4gICAgICAgIGNvbnN0IGludGVyc2VjdGlvblN1cHBvcnRlZCA9IHRoaXMuaW50ZXJzZWN0aW9uTGlzdGVuZXJTdXBwb3J0ZWQoKTtcblxuICAgICAgICBpZiAoaW50ZXJzZWN0aW9uU3VwcG9ydGVkKSB7XG4gICAgICAgICAgICBjb25zdCBpbnRlcnNlY3RPYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcih0aGlzLmFuaW1hdGVFbGVtZW50cy5iaW5kKHRoaXMpLCB7XG4gICAgICAgICAgICAgICAgcm9vdDogbnVsbCxcbiAgICAgICAgICAgICAgICByb290TWFyZ2luOiAnMjBweCcsXG4gICAgICAgICAgICAgICAgdGhyZXNob2xkOiAwLjUsXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGludGVyc2VjdE9ic2VydmVyLm9ic2VydmUoZWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5hbmltYXRlTGVnYWN5KGVsZW1lbnRzKTtcblxuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGVMZWdhY3koZWxlbWVudHMpO1xuICAgICAgICAgICAgfSwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYW5pbWF0ZUxlZ2FjeShlbGVtZW50cykge1xuICAgICAgICBlbGVtZW50cy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5lbGVtZW50SXNJblZpZXcoZWxlbWVudCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFuaW1hdGVFbGVtZW50cyhbZWxlbWVudF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhbmltYXRlRWxlbWVudHMoZWxlbWVudHMsIG9ic2VydmVyKSB7XG4gICAgICAgIGVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVsbSA9IGVsZW1lbnQudGFyZ2V0IHx8IGVsZW1lbnQ7XG5cbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnRDb25maWcgPSB0aGlzLnBhcnNlQ29uZmlnKGVsbSk7XG4gICAgICAgICAgICBjb25zdCBlbG1UZXh0ID0gZWxlbWVudC50YXJnZXQucXVlcnlTZWxlY3RvcihlbGVtZW50Q29uZmlnLml0ZW0udGV4dCk7XG5cbiAgICAgICAgICAgIGNvbnN0IGVsbVN2ZyA9IGVsZW1lbnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoZWxlbWVudENvbmZpZy5pdGVtLnN2Zyk7XG4gICAgICAgICAgICBjb25zdCBlbG1Db21wbGV0ZSA9IGVsbVN2Zy5xdWVyeVNlbGVjdG9yKGVsZW1lbnRDb25maWcuc3ZnQ2xhc3Nlcy5jb21wbGV0ZSk7XG4gICAgICAgICAgICBjb25zdCBlbG1QZXJjZW50YWdlID0gZWxtU3ZnLnF1ZXJ5U2VsZWN0b3IoZWxlbWVudENvbmZpZy5zdmdDbGFzc2VzLnBlcmNlbnRhZ2UpO1xuICAgICAgICAgICAgY29uc3QgZWxtRGFzaExlbmd0aCA9IE1hdGguY2VpbChlbG1Db21wbGV0ZS5nZXRUb3RhbExlbmd0aCgpKTtcblxuICAgICAgICAgICAgY29uc3QgZWxtRmlsbCA9IHBhcnNlRmxvYXQoZWxtRGFzaExlbmd0aCAtICgoZWxlbWVudENvbmZpZy5wZXJjZW50YWdlICogZWxtRGFzaExlbmd0aCkgLyAxMDApLCA1KTtcblxuICAgICAgICAgICAgaWYgKGVsbVBlcmNlbnRhZ2UpIHtcbiAgICAgICAgICAgICAgICBlbG1QZXJjZW50YWdlLnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSBlbG1GaWxsO1xuICAgICAgICAgICAgICAgIGVsbVBlcmNlbnRhZ2Uuc3R5bGUuc3Ryb2tlRGFzaGFycmF5ID0gZWxtRGFzaExlbmd0aDtcbiAgICAgICAgICAgICAgICBlbGVtZW50Q29uZmlnLmZpbGxMZW5ndGggPSBlbG1GaWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZWxtQ29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICBlbG1Db21wbGV0ZS5zdHlsZS5zdHJva2VEYXNoYXJyYXkgPSBlbG1EYXNoTGVuZ3RoO1xuICAgICAgICAgICAgICAgIGVsbUNvbXBsZXRlLnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSBlbG1EYXNoTGVuZ3RoO1xuICAgICAgICAgICAgICAgIGVsZW1lbnRDb25maWcuZGFzaExlbmd0aCA9IGVsbURhc2hMZW5ndGg7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGVsbVN2Zy5jbGFzc0xpc3QucmVtb3ZlKCdub3QtcmVhZHknKTtcblxuICAgICAgICAgICAgLy8gSWYgZHVyYXRpb24gaXMgbGVzcyB0aGFuIG9yIGVxdWFsIHplcm8sIGp1c3QgZm9ybWF0IHRoZSAnZW5kJyB2YWx1ZVxuICAgICAgICAgICAgaWYgKGVsZW1lbnRDb25maWcuZHVyYXRpb24gPD0gMCkge1xuICAgICAgICAgICAgICAgIGVsbUNvbXBsZXRlLnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSBlbG1GaWxsO1xuICAgICAgICAgICAgICAgIHJldHVybiBlbG1UZXh0LmlubmVySFRNTCA9IHBhcnNlSW50KGVsZW1lbnRDb25maWcucGVyY2VudGFnZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgoIW9ic2VydmVyICYmICF0aGlzLmVsZW1lbnRJc0luVmlldyhlbGVtZW50KSkgfHwgKG9ic2VydmVyICYmIGVsZW1lbnQuaW50ZXJzZWN0aW9uUmF0aW8gPCAwLjUpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBlbGVtZW50Q29uZmlnLnBlcmNlbnRhZ2UgPCBlbGVtZW50Q29uZmlnLnN0YXJ0ID8gZWxlbWVudENvbmZpZy5wZXJjZW50YWdlIDogZWxlbWVudENvbmZpZy5zdGFydDtcbiAgICAgICAgICAgICAgICBlbG1Db21wbGV0ZS5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gcGFyc2VGbG9hdChlbG1EYXNoTGVuZ3RoIC0gKCh2YWx1ZSAqIGVsbURhc2hMZW5ndGgpIC8gMTAwKSwgNSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsbVRleHQuaW5uZXJIVE1MID0gcGFyc2VJbnQodmFsdWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBkdXJhdGlvbiBpcyBtb3JlIHRoYW4gMCwgdGhlbiBzdGFydCB0aGUgY291bnRlclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnN0YXJ0Q291bnRlcihlbG0sIGVsbVRleHQsIGVsbUNvbXBsZXRlLCBlbGVtZW50Q29uZmlnKSwgZWxlbWVudENvbmZpZy5kZWxheSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHN0YXJ0Q291bnRlcihlbGVtZW50LCBlbGVtZW50VGV4dCwgZWxlbWVudENvbXBsZXRlLCBjb25maWcpIHtcbiAgICAgICAgLy8gRmlyc3QsIGdldCB0aGUgaW5jcmVtZW50cyBzdGVwXG4gICAgICAgIGxldCBpbmNyZW1lbnRzUGVyU3RlcCA9IChjb25maWcucGVyY2VudGFnZSAtIGNvbmZpZy5zdGFydCkgLyAoY29uZmlnLmR1cmF0aW9uIC8gY29uZmlnLmRlbGF5KTtcbiAgICAgICAgLy8gTmV4dCwgc2V0IHRoZSBjb3VudGVyIG1vZGUgKEluY3JlbWVudCBvciBEZWNyZW1lbnQpXG4gICAgICAgIGxldCBjb3VudE1vZGUgPSAnaW5jJztcblxuICAgICAgICAvLyBTZXQgbW9kZSB0byAnZGVjcmVtZW50JyBhbmQgJ2luY3JlbWVudCBzdGVwJyB0byBtaW51cyBpZiBzdGFydCBpcyBsYXJnZXIgdGhhbiBlbmRcbiAgICAgICAgaWYgKGNvbmZpZy5zdGFydCA+IGNvbmZpZy5wZXJjZW50YWdlKSB7XG4gICAgICAgICAgICBjb3VudE1vZGUgPSAnZGVjJztcbiAgICAgICAgICAgIGluY3JlbWVudHNQZXJTdGVwICo9IC0xO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTmV4dCwgZGV0ZXJtaW5lIHRoZSBzdGFydGluZyB2YWx1ZVxuICAgICAgICBsZXQgY3VycmVudENvdW50ID0gdGhpcy5wYXJzZVZhbHVlKGNvbmZpZy5zdGFydCk7XG4gICAgICAgIC8vIEFuZCB0aGVuIHByaW50IGl0J3MgdmFsdWUgdG8gdGhlIHBhZ2VcbiAgICAgICAgY29uc3QgY3VycmVudEZpbGwgPSBjb25maWcuZGFzaExlbmd0aCAtICgoY29uZmlnLnN0YXJ0ICogY29uZmlnLmRhc2hMZW5ndGgpIC8gMTAwKTtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhjdXJyZW50RmlsbCwgJyBjdXJyZW50IGZpbGwnKTtcblxuICAgICAgICBlbGVtZW50VGV4dC5pbm5lckhUTUwgPSBwYXJzZUludChjdXJyZW50Q291bnQpO1xuICAgICAgICBlbGVtZW50Q29tcGxldGUuc3R5bGUuc3Ryb2tlRGFzaG9mZnNldCA9IHBhcnNlRmxvYXQoY3VycmVudEZpbGwsIDUpO1xuXG4gICAgICAgIC8vIElmIHRoZSBjb25maWcgJ29uY2UnIGlzIHRydWUsIHRoZW4gc2V0IHRoZSAnZHVyYXRpb24nIHRvIDBcbiAgICAgICAgaWYgKGNvbmZpZy5vbmNlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1wcm9ncmVzcy1kdXJhdGlvbicsIDApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm93LCBzdGFydCBjb3VudGluZyB3aXRoIGNvdW50ZXJXb3JrZXIgdXNpbmcgSW50ZXJ2YWwgbWV0aG9kIGJhc2VkIG9uIGRlbGF5XG4gICAgICAgIGNvbnN0IGNvdW50ZXJXb3JrZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgICAvLyBGaXJzdCwgZGV0ZXJtaW5lIHRoZSBuZXh0IHZhbHVlIGJhc2Ugb24gY3VycmVudCB2YWx1ZSwgaW5jcmVtZW50IHZhbHVlLCBhbmQgY291bmQgbW9kZVxuICAgICAgICAgICAgY29uc3QgbmV4dE51bSA9IHRoaXMubmV4dE51bWJlcihjdXJyZW50Q291bnQsIGluY3JlbWVudHNQZXJTdGVwLCBjb3VudE1vZGUpO1xuXG4gICAgICAgICAgICBjb25zdCBuZXh0RmlsbCA9IGNvbmZpZy5kYXNoTGVuZ3RoIC0gKChuZXh0TnVtICogY29uZmlnLmRhc2hMZW5ndGgpIC8gMTAwKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKG5leHRGaWxsLCAnbmV4dCBmaWxsJyk7XG4gICAgICAgICAgICAvLyBOZXh0LCBwcmludCB0aGF0IHZhbHVlIHRvIHRoZSBwYWdlXG4gICAgICAgICAgICBlbGVtZW50VGV4dC5pbm5lckhUTUwgPSBwYXJzZUludChuZXh0TnVtKTtcbiAgICAgICAgICAgIGVsZW1lbnRDb21wbGV0ZS5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gcGFyc2VGbG9hdChuZXh0RmlsbCwgNSk7XG4gICAgICAgICAgICAvLyBOb3cgc2V0IHRoYXQgdmFsdWUgdG8gdGhlIGN1cnJlbnQgdmFsdWUsIGJlY291c2UgaXQncyBhbHJlYWR5IHByaW50ZWRcbiAgICAgICAgICAgIGN1cnJlbnRDb3VudCA9IG5leHROdW07XG5cbiAgICAgICAgICAgIC8vIElmIHRoZSB2YWx1ZSBpcyBsYXJnZXIgb3IgbGVzcyB0aGFuIHRoZSAnZW5kJyAoYmFzZSBvbiBtb2RlKSwgdGhlbiAgcHJpbnQgdGhlIGVuZCB2YWx1ZSBhbmQgc3RvcCB0aGUgSW50ZXJ2YWxcbiAgICAgICAgICAgIGlmICgoY3VycmVudENvdW50ID49IGNvbmZpZy5wZXJjZW50YWdlICYmIGNvdW50TW9kZSA9PT0gJ2luYycpIHx8IChjdXJyZW50Q291bnQgPD0gY29uZmlnLnBlcmNlbnRhZ2UgJiYgY291bnRNb2RlID09PSAnZGVjJykpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50VGV4dC5pbm5lckhUTUwgPSBwYXJzZUludChjb25maWcucGVyY2VudGFnZSk7XG4gICAgICAgICAgICAgICAgZWxlbWVudENvbXBsZXRlLnN0eWxlLnN0cm9rZURhc2hvZmZzZXQgPSBwYXJzZUZsb2F0KGNvbmZpZy5kYXNoTGVuZ3RoIC0gKChjb25maWcucGVyY2VudGFnZSAqIGNvbmZpZy5kYXNoTGVuZ3RoKSAvIDEwMCksIDUpO1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwoY291bnRlcldvcmtlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGNvbmZpZy5kZWxheSk7XG4gICAgfVxuXG4gICAgcGFyc2VDb25maWcoZWxlbWVudCkge1xuICAgICAgICBjb25zdCBiYXNlQ29uZmlnID0geyAuLi50aGlzLmNvbmZpZ09wdGlvbnMgfTtcblxuICAgICAgICBjb25zdCBjb25maWdWYWx1ZXMgPSBbXS5maWx0ZXIuY2FsbChlbGVtZW50LmF0dHJpYnV0ZXMsIChhdHRyKSA9PiAvXmRhdGEtcHJvZ3Jlc3MtLy50ZXN0KGF0dHIubmFtZSkpO1xuXG4gICAgICAgIGNvbnN0IGVsZW1lbnRDb25maWcgPSB7fTtcblxuICAgICAgICBjb25maWdWYWx1ZXMuZm9yRWFjaCgoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgbmFtZSA9IGUubmFtZS5yZXBsYWNlKCdkYXRhLXByb2dyZXNzLScsICcnKS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJhZGl4XG4gICAgICAgICAgICBjb25zdCB2YWx1ZSA9IG5hbWUgPT09ICdkdXJhdGlvbicgPyBwYXJzZUludCh0aGlzLnBhcnNlVmFsdWUoZS52YWx1ZSkgKiAxMDAwKSA6IHRoaXMucGFyc2VWYWx1ZShlLnZhbHVlKTtcbiAgICAgICAgICAgIGVsZW1lbnRDb25maWdbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZWxlbWVudENvbmZpZy5wZXJjZW50YWdlID4gMTAwID8gZWxlbWVudENvbmZpZy5wZXJjZW50YWdlID0gMTAwIDogZWxlbWVudENvbmZpZy5wZXJjZW50YWdlO1xuICAgICAgICBlbGVtZW50Q29uZmlnLnN0YXJ0IDwgMCA/IGVsZW1lbnRDb25maWcuc3RhcnQgPSAwIDogZWxlbWVudENvbmZpZy5zdGFydDtcblxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihiYXNlQ29uZmlnLCBlbGVtZW50Q29uZmlnKTtcbiAgICB9XG5cbiAgICAvKiogVGhpcyBmdW5jdGlvbiBpcyB0byBnZXQgdGhlIG5leHQgbnVtYmVyICovXG4gICAgbmV4dE51bWJlcihudW1iZXIsIHN0ZXBzLCBtb2RlID0gJ2luYycpIHtcbiAgICAgICAgLy8gRmlyc3QsIGdldCB0aGUgZXhhY3QgdmFsdWUgZnJvbSB0aGUgbnVtYmVyIGFuZCBzdGVwIChpbnQgb3IgZmxvYXQpXG4gICAgICAgIG51bWJlciA9IHRoaXMucGFyc2VWYWx1ZShudW1iZXIpO1xuICAgICAgICBzdGVwcyA9IHRoaXMucGFyc2VWYWx1ZShzdGVwcyk7XG5cbiAgICAgICAgLy8gTGFzdCwgZ2V0IHRoZSBuZXh0IG51bWJlciBiYXNlZCBvbiBjdXJyZW50IG51bWJlciwgaW5jcmVtZW50IHN0ZXAsIGFuZCBjb3VudCBtb2RlXG4gICAgICAgIC8vIEFsd2F5cyByZXR1cm4gaXQgYXMgZmxvYXRcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQobW9kZSA9PT0gJ2luYycgPyAobnVtYmVyICsgc3RlcHMpIDogKG51bWJlciAtIHN0ZXBzKSk7XG4gICAgfVxuXG4gICAgLyoqIFRoaXMgZnVuY3Rpb24gaXMgdG8gZ2V0IHRoZSBwYXJzZWQgdmFsdWUgKi9cbiAgICBwYXJzZVZhbHVlKGRhdGEpIHtcbiAgICAgICAgLy8gSWYgbnVtYmVyIHdpdGggZG90ICguKSwgd2lsbCBiZSBwYXJzZWQgYXMgZmxvYXRcbiAgICAgICAgaWYgKC9eWzAtOV0rXFwuWzAtOV0rJC8udGVzdChkYXRhKSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYganVzdCBudW1iZXIsIHdpbGwgYmUgcGFyc2VkIGFzIGludGVnZXJcbiAgICAgICAgaWYgKC9eWzAtOV0rJC8udGVzdChkYXRhKSkge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIC8vIElmIGl0J3MgYm9vbGVhbiBzdHJpbmcsIHdpbGwgYmUgcGFyc2VkIGFzIGJvb2xlYW5cbiAgICAgICAgaWYgKC9edHJ1ZXxmYWxzZS9pLnRlc3QoZGF0YSkpIHtcbiAgICAgICAgICAgIHJldHVybiAvXnRydWUvaS50ZXN0KGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFJldHVybiBpdCdzIHZhbHVlIGFzIGRlZmF1bHRcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgLyoqIFRoaXMgZnVuY3Rpb24gaXMgdG8gZGV0ZWN0IHRoZSBlbGVtZW50IGlzIGluIHZpZXcgb3Igbm90LiAqL1xuICAgIGVsZW1lbnRJc0luVmlldyhlbGVtZW50KSB7XG4gICAgICAgIGxldCB0b3AgPSBlbGVtZW50Lm9mZnNldFRvcDtcbiAgICAgICAgbGV0IGxlZnQgPSBlbGVtZW50Lm9mZnNldExlZnQ7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgY29uc3QgaGVpZ2h0ID0gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG5cbiAgICAgICAgd2hpbGUgKGVsZW1lbnQub2Zmc2V0UGFyZW50KSB7XG4gICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5vZmZzZXRQYXJlbnQ7XG4gICAgICAgICAgICB0b3AgKz0gZWxlbWVudC5vZmZzZXRUb3A7XG4gICAgICAgICAgICBsZWZ0ICs9IGVsZW1lbnQub2Zmc2V0TGVmdDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0b3AgPj0gd2luZG93LnBhZ2VZT2Zmc2V0XG4gICAgICAgICAgICAmJiBsZWZ0ID49IHdpbmRvdy5wYWdlWE9mZnNldFxuICAgICAgICAgICAgJiYgKHRvcCArIGhlaWdodCkgPD0gKHdpbmRvdy5wYWdlWU9mZnNldCArIHdpbmRvdy5pbm5lckhlaWdodClcbiAgICAgICAgICAgICYmIChsZWZ0ICsgd2lkdGgpIDw9ICh3aW5kb3cucGFnZVhPZmZzZXQgKyB3aW5kb3cuaW5uZXJXaWR0aClcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKiogSnVzdCBzb21lIGNvbmRpdGlvbiB0byBjaGVjayBicm93c2VyIEludGVyc2VjdGlvbiBTdXBwb3J0ICovXG4gICAgaW50ZXJzZWN0aW9uTGlzdGVuZXJTdXBwb3J0ZWQoKSB7XG4gICAgICAgIHJldHVybiAoJ0ludGVyc2VjdGlvbk9ic2VydmVyJyBpbiB3aW5kb3cpXG4gICAgICAgICAgICAmJiAoJ0ludGVyc2VjdGlvbk9ic2VydmVyRW50cnknIGluIHdpbmRvdylcbiAgICAgICAgICAgICYmICgnaW50ZXJzZWN0aW9uUmF0aW8nIGluIHdpbmRvdy5JbnRlcnNlY3Rpb25PYnNlcnZlckVudHJ5LnByb3RvdHlwZSk7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFByb2dyZXNzQ2lyY2xlQ291bnRlcjtcbiIsIi8qKlxuICogRFMgQ291bnRlciAgMS4wLjBcbiAqXG4gKiBiYXNlZCBvbjogaHR0cHM6Ly9naXRodWIuY29tL3NyZXhpL3B1cmVjb3VudGVyanNcbiAqIFdyaXR0ZW4gb246IEFwcmlsIDE1LCAyMDIxXG4gKlxuICogVVNBR0U6XG4gKi9cblxuY2xhc3MgUHVyZUNvdW50ZXIge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIHN0YXJ0OiAwLFxuICAgICAgICAgICAgZW5kOiAxMDAsXG4gICAgICAgICAgICBkdXJhdGlvbjogMjAwMCxcbiAgICAgICAgICAgIGRlbGF5OiAxMCxcbiAgICAgICAgICAgIG9uY2U6IHRydWUsXG4gICAgICAgICAgICBkZWNpbWFsczogMCxcbiAgICAgICAgICAgIGxlZ2FjeTogdHJ1ZSxcbiAgICAgICAgICAgIGN1cnJlbmN5OiBmYWxzZSxcbiAgICAgICAgICAgIGN1cnJlbmN5c3ltYm9sOiBmYWxzZSxcbiAgICAgICAgICAgIHNlcGFyYXRvcjogZmFsc2UsXG4gICAgICAgICAgICBzZXBhcmF0b3JzeW1ib2w6ICcsJyxcbiAgICAgICAgICAgIHNlbGVjdG9yOiAnLnB1cmVjb3VudGVyJ1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb25maWdPcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0cywgb3B0aW9ucyB8fCB7fSk7XG5cbiAgICAgICAgdGhpcy5yZWdpc3RlckV2ZW50TGlzdGVuZXJzKCk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJFdmVudExpc3RlbmVycygpIHtcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLmNvbmZpZ09wdGlvbnMuc2VsZWN0b3IpO1xuICAgICAgICB2YXIgaW50ZXJzZWN0aW9uU3VwcG9ydGVkID0gdGhpcy5pbnRlcnNlY3Rpb25MaXN0ZW5lclN1cHBvcnRlZCgpO1xuXG4gICAgICAgIGlmIChpbnRlcnNlY3Rpb25TdXBwb3J0ZWQpIHtcbiAgICAgICAgICAgIHZhciBpbnRlcnNlY3RPYnNlcnZlciA9IG5ldyBJbnRlcnNlY3Rpb25PYnNlcnZlcih0aGlzLmFuaW1hdGVFbGVtZW50cy5iaW5kKHRoaXMpLCB7XG4gICAgICAgICAgICAgICAgXCJyb290XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJyb290TWFyZ2luXCI6ICcyMHB4JyxcbiAgICAgICAgICAgICAgICBcInRocmVzaG9sZFwiOiAwLjVcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBlbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgICAgIGludGVyc2VjdE9ic2VydmVyLm9ic2VydmUoZWxlbWVudCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRlTGVnYWN5KGVsZW1lbnRzKTtcblxuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbmltYXRlTGVnYWN5KGVsZW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9LCB7IFwicGFzc2l2ZVwiOiB0cnVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYW5pbWF0ZUxlZ2FjeShlbGVtZW50cykge1xuICAgICAgICBlbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgdmFyIGNvbmZpZyA9IHRoaXMucGFyc2VDb25maWcoZWxlbWVudCk7XG4gICAgICAgICAgICBpZihjb25maWcubGVnYWN5ID09PSB0cnVlICYmIHRoaXMuZWxlbWVudElzSW5WaWV3KGVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hbmltYXRlRWxlbWVudHMoW2VsZW1lbnRdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBhbmltYXRlRWxlbWVudHMoZWxlbWVudHMsIG9ic2VydmVyKSB7XG4gICAgICAgIGVsZW1lbnRzLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICB2YXIgZWxtID0gZWxlbWVudC50YXJnZXQgfHwgZWxlbWVudDsgLy8gSnVzdCBtYWtlIHN1cmUgd2hpY2ggZWxlbWVudCB3aWxsIGJlIHVzZWRcbiAgICAgICAgICAgIHZhciBlbGVtZW50Q29uZmlnID0gdGhpcy5wYXJzZUNvbmZpZyhlbG0pOyAvLyBHZXQgY29uZmlnIHZhbHVlIG9uIHRoYXQgZWxlbWVudFxuXG4gICAgICAgICAgICAvLyBJZiBkdXJhdGlvbiBpcyBsZXNzIHRoYW4gb3IgZXF1YWwgemVybywganVzdCBmb3JtYXQgdGhlICdlbmQnIHZhbHVlXG4gICAgICAgICAgICBpZiAoZWxlbWVudENvbmZpZy5kdXJhdGlvbiA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGVsbS5pbm5lckhUTUwgPSB0aGlzLmZvcm1hdE51bWJlcihlbGVtZW50Q29uZmlnLmVuZCwgZWxlbWVudENvbmZpZyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgoIW9ic2VydmVyICYmICF0aGlzLmVsZW1lbnRJc0luVmlldyhlbGVtZW50KSkgfHwgKG9ic2VydmVyICYmIGVsZW1lbnQuaW50ZXJzZWN0aW9uUmF0aW8gPCAwLjUpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gZWxlbWVudENvbmZpZy5zdGFydCA+IGVsZW1lbnRDb25maWcuZW5kID8gZWxlbWVudENvbmZpZy5lbmQgOiBlbGVtZW50Q29uZmlnLnN0YXJ0O1xuICAgICAgICAgICAgICAgIHJldHVybiBlbG0uaW5uZXJIVE1MID0gdGhpcy5mb3JtYXROdW1iZXIodmFsdWUsIGVsZW1lbnRDb25maWcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBkdXJhdGlvbiBpcyBtb3JlIHRoYW4gMCwgdGhlbiBzdGFydCB0aGUgY291bnRlclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RhcnRDb3VudGVyKGVsbSwgZWxlbWVudENvbmZpZyk7XG4gICAgICAgICAgICB9LCBlbGVtZW50Q29uZmlnLmRlbGF5KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc3RhcnRDb3VudGVyKGVsZW1lbnQsIGNvbmZpZykge1xuICAgICAgICAvLyBGaXJzdCwgZ2V0IHRoZSBpbmNyZW1lbnRzIHN0ZXBcbiAgICAgICAgdmFyIGluY3JlbWVudHNQZXJTdGVwID0gKGNvbmZpZy5lbmQgLSBjb25maWcuc3RhcnQpIC8gKGNvbmZpZy5kdXJhdGlvbiAvIGNvbmZpZy5kZWxheSk7XG4gICAgICAgIC8vIE5leHQsIHNldCB0aGUgY291bnRlciBtb2RlIChJbmNyZW1lbnQgb3IgRGVjcmVtZW50KVxuICAgICAgICB2YXIgY291bnRNb2RlID0gJ2luYyc7XG5cbiAgICAgICAgLy8gU2V0IG1vZGUgdG8gJ2RlY3JlbWVudCcgYW5kICdpbmNyZW1lbnQgc3RlcCcgdG8gbWludXMgaWYgc3RhcnQgaXMgbGFyZ2VyIHRoYW4gZW5kXG4gICAgICAgIGlmIChjb25maWcuc3RhcnQgPiBjb25maWcuZW5kKSB7XG4gICAgICAgICAgICBjb3VudE1vZGUgPSAnZGVjJztcbiAgICAgICAgICAgIGluY3JlbWVudHNQZXJTdGVwICo9IC0xO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTmV4dCwgZGV0ZXJtaW5lIHRoZSBzdGFydGluZyB2YWx1ZVxuICAgICAgICB2YXIgY3VycmVudENvdW50ID0gdGhpcy5wYXJzZVZhbHVlKGNvbmZpZy5zdGFydCk7XG4gICAgICAgIC8vIEFuZCB0aGVuIHByaW50IGl0J3MgdmFsdWUgdG8gdGhlIHBhZ2VcbiAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLmZvcm1hdE51bWJlcihjdXJyZW50Q291bnQsIGNvbmZpZyk7XG5cbiAgICAgICAgLy8gSWYgdGhlIGNvbmZpZyAnb25jZScgaXMgdHJ1ZSwgdGhlbiBzZXQgdGhlICdkdXJhdGlvbicgdG8gMFxuICAgICAgICBpZihjb25maWcub25jZSA9PT0gdHJ1ZSl7XG4gICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS1wdXJlY291bnRlci1kdXJhdGlvbicsIDApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gTm93LCBzdGFydCBjb3VudGluZyB3aXRoIGNvdW50ZXJXb3JrZXIgdXNpbmcgSW50ZXJ2YWwgbWV0aG9kIGJhc2VkIG9uIGRlbGF5XG4gICAgICAgIHZhciBjb3VudGVyV29ya2VyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgLy8gRmlyc3QsIGRldGVybWluZSB0aGUgbmV4dCB2YWx1ZSBiYXNlIG9uIGN1cnJlbnQgdmFsdWUsIGluY3JlbWVudCB2YWx1ZSwgYW5kIGNvdW5kIG1vZGVcbiAgICAgICAgICAgIHZhciBuZXh0TnVtID0gdGhpcy5uZXh0TnVtYmVyKGN1cnJlbnRDb3VudCwgaW5jcmVtZW50c1BlclN0ZXAsIGNvdW50TW9kZSk7XG4gICAgICAgICAgICAvLyBOZXh0LCBwcmludCB0aGF0IHZhbHVlIHRvIHRoZSBwYWdlXG4gICAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IHRoaXMuZm9ybWF0TnVtYmVyKG5leHROdW0sIGNvbmZpZyk7XG4gICAgICAgICAgICAvLyBOb3cgc2V0IHRoYXQgdmFsdWUgdG8gdGhlIGN1cnJlbnQgdmFsdWUsIGJlY291c2UgaXQncyBhbHJlYWR5IHByaW50ZWRcbiAgICAgICAgICAgIGN1cnJlbnRDb3VudCA9IG5leHROdW07XG5cbiAgICAgICAgICAgIC8vIElmIHRoZSB2YWx1ZSBpcyBsYXJnZXIgb3IgbGVzcyB0aGFuIHRoZSAnZW5kJyAoYmFzZSBvbiBtb2RlKSwgdGhlbiAgcHJpbnQgdGhlIGVuZCB2YWx1ZSBhbmQgc3RvcCB0aGUgSW50ZXJ2YWxcbiAgICAgICAgICAgIGlmICgoY3VycmVudENvdW50ID49IGNvbmZpZy5lbmQgJiYgY291bnRNb2RlID09ICdpbmMnKSB8fCAoY3VycmVudENvdW50IDw9IGNvbmZpZy5lbmQgJiYgY291bnRNb2RlID09ICdkZWMnKSkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy5mb3JtYXROdW1iZXIoY29uZmlnLmVuZCwgY29uZmlnKTtcbiAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKGNvdW50ZXJXb3JrZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBjb25maWcuZGVsYXkpO1xuICAgIH1cblxuICAgIHBhcnNlQ29uZmlnKGVsZW1lbnQpIHtcblxuICAgICAgICAvLyBGaXJzdCwgd2UgbmVlZCB0byBkZWNsYXJlIHRoZSBiYXNlIENvbmZpZ1xuICAgICAgICAvLyBUaGlzIGNvbmZpZyB3aWxsIGJlIHVzZWQgaWYgdGhlIGVsZW1lbnQgZG9lc24ndCBoYXZlIGNvbmZpZ1xuICAgICAgICB2YXIgYmFzZUNvbmZpZyA9IHsuLi50aGlzLmNvbmZpZ09wdGlvbnN9O1xuXG4gICAgICAgIC8vIE5leHQsIGdldHQgYWxsICdkYXRhLXByZWNvdW50ZXInIGF0dHJpYnV0ZXMgdmFsdWUuIFN0b3JlIHRvIGFycmF5XG4gICAgICAgIHZhciBjb25maWdWYWx1ZXMgPSBbXS5maWx0ZXIuY2FsbChlbGVtZW50LmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgICAgICAgIHJldHVybiAvXmRhdGEtcHVyZWNvdW50ZXItLy50ZXN0KGF0dHIubmFtZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIE5vdywgd2UgY3JlYXRlIGVsZW1lbnQgY29uZmlnIGFzIGFuIGVtcHR5IG9iamVjdFxuICAgICAgICB2YXIgZWxlbWVudENvbmZpZyA9IHt9O1xuXG4gICAgICAgIC8vIEFuZCB0aGVuLCBmaWxsIHRoZSBlbGVtZW50IGNvbmZpZyBiYXNlZCBvbiBjb25maWcgdmFsdWVzXG4gICAgICAgIGNvbmZpZ1ZhbHVlcy5mb3JFYWNoKGUgPT4ge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBlLm5hbWUucmVwbGFjZSgnZGF0YS1wdXJlY291bnRlci0nLCAnJykudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IG5hbWUgPT0gJ2R1cmF0aW9uJyA/IHBhcnNlSW50KHRoaXMucGFyc2VWYWx1ZShlLnZhbHVlKSAqIDEwMDApIDogdGhpcy5wYXJzZVZhbHVlKGUudmFsdWUpO1xuICAgICAgICAgICAgZWxlbWVudENvbmZpZ1tuYW1lXSA9IHZhbHVlOyAvLyBXZSB3aWxsIGdldCBhbiBvYmplY3RcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBMYXN0IG1hcmdlIGJhc2UgY29uZmlnIHdpdGggZWxlbWVudCBjb25maWcgYW5kIHJldHVybiBpdCBhcyBhbiBvYmplY3RcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oYmFzZUNvbmZpZywgZWxlbWVudENvbmZpZyk7XG5cbiAgICB9XG5cbiAgICAvKiogVGhpcyBmdW5jdGlvbiBpcyB0byBnZXQgdGhlIG5leHQgbnVtYmVyICovXG4gICAgbmV4dE51bWJlcihudW1iZXIsIHN0ZXBzLCBtb2RlID0gJ2luYycpIHtcbiAgICAgICAgLy8gRmlyc3QsIGdldCB0aGUgZXhhY3QgdmFsdWUgZnJvbSB0aGUgbnVtYmVyIGFuZCBzdGVwIChpbnQgb3IgZmxvYXQpXG4gICAgICAgIG51bWJlciA9IHRoaXMucGFyc2VWYWx1ZShudW1iZXIpO1xuICAgICAgICBzdGVwcyA9IHRoaXMucGFyc2VWYWx1ZShzdGVwcyk7XG5cbiAgICAgICAgLy8gTGFzdCwgZ2V0IHRoZSBuZXh0IG51bWJlciBiYXNlZCBvbiBjdXJyZW50IG51bWJlciwgaW5jcmVtZW50IHN0ZXAsIGFuZCBjb3VudCBtb2RlXG4gICAgICAgIC8vIEFsd2F5cyByZXR1cm4gaXQgYXMgZmxvYXRcbiAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQobW9kZSA9PT0gJ2luYycgPyAobnVtYmVyICsgc3RlcHMpIDogKG51bWJlciAtIHN0ZXBzKSk7XG4gICAgfVxuXG4gICAgLyoqIFRoaXMgZnVuY3Rpb24gaXMgdG8gY29udmVydCBudW1iZXIgaW50byBjdXJyZW5jeSBmb3JtYXQgKi9cbiAgICBjb252ZXJ0VG9DdXJyZW5jeVN5c3RlbSAobnVtYmVyLCBjb25maWcpIHtcbiAgICAgICAgdmFyIHN5bWJvbCA9IGNvbmZpZy5jdXJyZW5jeXN5bWJvbCB8fCBcIlwiLCAvLyBTZXQgdGhlIEN1cnJlbmN5IFN5bWJvbCAoaWYgYW55KVxuICAgICAgICAgICAgbGltaXQgPSBjb25maWcuZGVjaW1hbHMgfHwgMSwgIC8vIFNldCB0aGUgZGVjaW1hbCBsaW1pdCAoZGVmYXVsdCBpcyAxKVxuICAgICAgICAgICAgbnVtYmVyID0gTWF0aC5hYnMoTnVtYmVyKG51bWJlcikpOyAvLyBHZXQgdGhlIGFic29sdXRlIHZhbHVlIG9mIG51bWJlclxuXG4gICAgICAgIC8vIFNldCB0aGUgdmFsdWVcbiAgICAgICAgdmFyIHZhbHVlID0gbnVtYmVyID49IDEuMGUrMTIgPyBgJHsobnVtYmVyIC8gMS4wZSsxMikudG9GaXhlZChsaW1pdCl9IFRgIC8vIFR3ZWx2ZSB6ZXJvcyBmb3IgVHJpbGxpb25zXG4gICAgICAgICAgICA6IG51bWJlciA+PSAxLjBlKzkgPyBgJHsobnVtYmVyIC8gMS4wZSs5KS50b0ZpeGVkKGxpbWl0KX0gQmAgLy8gTmluZSB6ZXJvcyBmb3IgQmlsbGlvbnNcbiAgICAgICAgICAgICAgICA6IG51bWJlciA+PSAxLjBlKzYgPyBgJHsobnVtYmVyIC8gMS4wZSs2KS50b0ZpeGVkKGxpbWl0KX0gTWAgIC8vIFNpeCB6ZXJvcyBmb3IgTWlsbGlvbnNcbiAgICAgICAgICAgICAgICAgICAgOiBudW1iZXIgPj0gMS4wZSszID8gYCR7KG51bWJlciAvIDEuMGUrMTIpLnRvRml4ZWQobGltaXQpfSBLYCAvLyBUaHJlZSB6ZXJvcyBmb3IgVGhhdXNhbmRzXG4gICAgICAgICAgICAgICAgICAgICAgICA6IG51bWJlci50b0ZpeGVkKGxpbWl0KTsgLy8gSWYgbGVzcyB0aGFuIDEwMDAsIHByaW50IGl0J3MgdmFsdWVcblxuICAgICAgICAvLyBBcHBseSBzeW1ib2wgYmVmb3JlIHRoZSB2YWx1ZSBhbmQgcmV0dXJuIGl0IGFzIHN0cmluZ1xuICAgICAgICByZXR1cm4gc3ltYm9sICsgdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqIFRoaXMgZnVuY3Rpb24gaXMgdG8gZ2V0IHRoZSBsYXN0IGZvcm1hdGVkIG51bWJlciAqL1xuICAgIGFwcGx5U2VwYXJhdG9yKHZhbHVlLCBjb25maWcpe1xuICAgICAgICAvLyBJZiBjb25maWcgc2VwYXJhdG9yIGlzIGZhbHNlLCBkZWxldGUgYWxsIHNlcGFyYXRvclxuICAgICAgICBpZiAoIWNvbmZpZy5zZXBhcmF0b3IpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKG5ldyBSZWdFeHAoLywvZ2ksICdnaScpLCAnJylcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIGNvbmZpZyBzZXBhcmF0b3IgaXMgdHJ1ZSwgdGhlbiBjcmVhdGUgc2VwYXJhdG9yXG4gICAgICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC8oXFxkKSg/PShcXGR7M30pKyg/IVxcZCkpL2csIFwiJDEsXCIpXG4gICAgICAgICAgICAucmVwbGFjZShuZXcgUmVnRXhwKC8sL2dpLCAnZ2knKSwgY29uZmlnLnNlcGFyYXRvcnN5bWJvbClcbiAgICB9XG5cbiAgICAvKiogVGhpcyBmdW5jdGlvbiBpcyB0byBnZXQgZm9ybWF0ZWQgbnVtYmVyIHRvIGJlIHByaW50ZWQgaW4gdGhlIHBhZ2UgKi9cbiAgICBmb3JtYXROdW1iZXIobnVtYmVyLCBjb25maWcpIHtcbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgY29uZmlndXJhdGlvbiBmb3IgJ3RvTG9jYWxlU3RyaW5nJyBtZXRob2RcbiAgICAgICAgdmFyIHN0ckNvbmZpZyA9IHttaW5pbXVtRnJhY3Rpb25EaWdpdHM6IGNvbmZpZy5kZWNpbWFscywgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiBjb25maWcuZGVjaW1hbHN9O1xuICAgICAgICAvLyBTZXQgdGhlIG51bWJlciBpZiBpdCB1c2luZyBjdXJyZW5jeSwgdGhlbiBjb252ZXJ0LiBJZiBkb2Vzbid0LCBqdXN0IHBhcnNlIGl0IGFzIGZsb2F0XG4gICAgICAgIG51bWJlciA9IGNvbmZpZy5jdXJyZW5jeSA/IHRoaXMuY29udmVydFRvQ3VycmVuY3lTeXN0ZW0obnVtYmVyLCBjb25maWcpIDogcGFyc2VGbG9hdChudW1iZXIpO1xuXG4gICAgICAgIC8vIExhc3QsIGFwcGx5IHRoZSBudW1iZXIgc2VwYXJhdG9yIHVzaW5nIG51bWJlciBhcyBzdHJpbmdcbiAgICAgICAgcmV0dXJuIHRoaXMuYXBwbHlTZXBhcmF0b3IobnVtYmVyLnRvTG9jYWxlU3RyaW5nKHVuZGVmaW5lZCwgc3RyQ29uZmlnKSwgY29uZmlnKTtcbiAgICB9XG5cbiAgICAvKiogVGhpcyBmdW5jdGlvbiBpcyB0byBnZXQgdGhlIHBhcnNlZCB2YWx1ZSAqL1xuICAgIHBhcnNlVmFsdWUoZGF0YSkge1xuICAgICAgICAvLyBJZiBudW1iZXIgd2l0aCBkb3QgKC4pLCB3aWxsIGJlIHBhcnNlZCBhcyBmbG9hdFxuICAgICAgICBpZiAoL15bMC05XStcXC5bMC05XSskLy50ZXN0KGRhdGEpKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJZiBqdXN0IG51bWJlciwgd2lsbCBiZSBwYXJzZWQgYXMgaW50ZWdlclxuICAgICAgICBpZiAoL15bMC05XSskLy50ZXN0KGRhdGEpKSB7XG4gICAgICAgICAgICByZXR1cm4gcGFyc2VJbnQoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gSWYgaXQncyBib29sZWFuIHN0cmluZywgd2lsbCBiZSBwYXJzZWQgYXMgYm9vbGVhblxuICAgICAgICBpZiAoL150cnVlfGZhbHNlL2kudGVzdChkYXRhKSkge1xuICAgICAgICAgICAgcmV0dXJuIC9edHJ1ZS9pLnRlc3QoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmV0dXJuIGl0J3MgdmFsdWUgYXMgZGVmYXVsdFxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICAvKiogVGhpcyBmdW5jdGlvbiBpcyB0byBkZXRlY3QgdGhlIGVsZW1lbnQgaXMgaW4gdmlldyBvciBub3QuICovXG4gICAgZWxlbWVudElzSW5WaWV3KGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIHRvcCA9IGVsZW1lbnQub2Zmc2V0VG9wO1xuICAgICAgICB2YXIgbGVmdCA9IGVsZW1lbnQub2Zmc2V0TGVmdDtcbiAgICAgICAgdmFyIHdpZHRoID0gZWxlbWVudC5vZmZzZXRXaWR0aDtcbiAgICAgICAgdmFyIGhlaWdodCA9IGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuXG4gICAgICAgIHdoaWxlIChlbGVtZW50Lm9mZnNldFBhcmVudCkge1xuICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQub2Zmc2V0UGFyZW50O1xuICAgICAgICAgICAgdG9wICs9IGVsZW1lbnQub2Zmc2V0VG9wO1xuICAgICAgICAgICAgbGVmdCArPSBlbGVtZW50Lm9mZnNldExlZnQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgdG9wID49IHdpbmRvdy5wYWdlWU9mZnNldCAmJlxuICAgICAgICAgICAgbGVmdCA+PSB3aW5kb3cucGFnZVhPZmZzZXQgJiZcbiAgICAgICAgICAgICh0b3AgKyBoZWlnaHQpIDw9ICh3aW5kb3cucGFnZVlPZmZzZXQgKyB3aW5kb3cuaW5uZXJIZWlnaHQpICYmXG4gICAgICAgICAgICAobGVmdCArIHdpZHRoKSA8PSAod2luZG93LnBhZ2VYT2Zmc2V0ICsgd2luZG93LmlubmVyV2lkdGgpXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqIEp1c3Qgc29tZSBjb25kaXRpb24gdG8gY2hlY2sgYnJvd3NlciBJbnRlcnNlY3Rpb24gU3VwcG9ydCAqL1xuICAgIGludGVyc2VjdGlvbkxpc3RlbmVyU3VwcG9ydGVkKCkge1xuICAgICAgICByZXR1cm4gKCdJbnRlcnNlY3Rpb25PYnNlcnZlcicgaW4gd2luZG93KSAmJlxuICAgICAgICAgICAgKCdJbnRlcnNlY3Rpb25PYnNlcnZlckVudHJ5JyBpbiB3aW5kb3cpICYmXG4gICAgICAgICAgICAoJ2ludGVyc2VjdGlvblJhdGlvJyBpbiB3aW5kb3cuSW50ZXJzZWN0aW9uT2JzZXJ2ZXJFbnRyeS5wcm90b3R5cGUpO1xuICAgIH1cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBQdXJlQ291bnRlcjsiLCJmdW5jdGlvbiBjb3VudHJ5QWpheENhbGwoY29udGluZW50KSB7XG4gICAgY29uc3QgYWpheERhdGEgPSB7XG4gICAgICAgIGFjdGlvbjogJ2dldF9maWx0ZXJlZF9sdWJyaWNhbnRzJyxcbiAgICAgICAgY29udGluZW50LFxuICAgIH07XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIHVybDogZHMuYWpheF91cmwsXG4gICAgICAgIGRhdGE6IGFqYXhEYXRhLFxuICAgICAgICBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhLmNvdW50cmllcykge1xuICAgICAgICAgICAgICAgICAgICAkKCcuanMtY291bnRyeS1maWx0ZXInKS5odG1sKHJlc3BvbnNlLmRhdGEuY291bnRyaWVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGx1YnJpY2FudHNBamF4Q2FsbChjb3VudHJ5LCB0eXBlKSB7XG4gICAgY29uc3QgYWpheERhdGEgPSB7XG4gICAgICAgIGFjdGlvbjogJ2dldF9maWx0ZXJlZF9sdWJyaWNhbnRzJyxcbiAgICAgICAgY291bnRyeSxcbiAgICAgICAgdHlwZSxcbiAgICB9O1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICB1cmw6IGRzLmFqYXhfdXJsLFxuICAgICAgICBkYXRhOiBhamF4RGF0YSxcbiAgICAgICAgc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAkKCcuanMtbHVicmljYW50cy1jb250YWluZXInKS5odG1sKHJlc3BvbnNlLmRhdGEubHVicmljYW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGxvYWRNb3JlQWpheENhbGwocGFnZWQpIHtcbiAgICBjb25zdCBhamF4RGF0YSA9IHtcbiAgICAgICAgYWN0aW9uOiAnZ2V0X2ZpbHRlcmVkX2x1YnJpY2FudHMnLFxuICAgICAgICBwYWdlZCxcbiAgICB9O1xuICAgIGpRdWVyeS5hamF4KHtcbiAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICB1cmw6IGRzLmFqYXhfdXJsLFxuICAgICAgICBkYXRhOiBhamF4RGF0YSxcbiAgICAgICAgc3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZWQgPj0gcmVzcG9uc2UuZGF0YS5tYXhfcGFnZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmxvYWQtbW9yZScpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJCgnLmpzLWx1YnJpY2FudHMtY29udGFpbmVyJykuYXBwZW5kKHJlc3BvbnNlLmRhdGEubHVicmljYW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZHNfbHVicmljYW50c19maWx0ZXJzKCkge1xuICAgICQoJy5qcy1jb250aW5lbnQtc2VsZWN0Jykub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgICAgY29uc3QgY29udGluZW50ID0gJCgnLmpzLWNvbnRpbmVudC1zZWxlY3QnKS52YWwoKTtcbiAgICAgICAgY291bnRyeUFqYXhDYWxsKGNvbnRpbmVudCk7XG4gICAgfSk7XG5cbiAgICAkKCcuanMtY291bnRyeS1maWx0ZXInKS5vbignY2hhbmdlJywgJy5qcy1jb3VudHJ5LXNlbGVjdCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgY291bnRyeSA9ICQoJy5qcy1jb3VudHJ5LXNlbGVjdCcpLnZhbCgpO1xuICAgICAgICBjb25zdCB0eXBlID0gJCgnLmpzLXR5cGUtc2VsZWN0JykudmFsKCk7XG4gICAgICAgIGx1YnJpY2FudHNBamF4Q2FsbChjb3VudHJ5LCB0eXBlKTtcbiAgICB9KTtcblxuICAgICQoJy5qcy10eXBlLXNlbGVjdCcpLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvdW50cnkgPSAkKCcuanMtY291bnRyeS1zZWxlY3QnKS52YWwoKTtcbiAgICAgICAgY29uc3QgdHlwZSA9ICQoJy5qcy10eXBlLXNlbGVjdCcpLnZhbCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhjb3VudHJ5KTtcbiAgICAgICAgY29uc29sZS5sb2codHlwZSk7XG4gICAgICAgIGx1YnJpY2FudHNBamF4Q2FsbChjb3VudHJ5LCB0eXBlKTtcbiAgICB9KTtcblxuICAgIGxldCBjdXJyZW50UGFnZSA9IDE7XG4gICAgJCgnLmxvYWQtbW9yZScpLm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgY3VycmVudFBhZ2UrKztcbiAgICAgICAgbG9hZE1vcmVBamF4Q2FsbChjdXJyZW50UGFnZSk7XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgeyB1X2V4dGVuZE9iamVjdCB9IGZyb20gXCIuLi8uLi91dGlscy91X29iamVjdF9leHRlbmRcIjtcblxuY2xhc3MgRFNNUE1lZGlhQ29udHJvbHMge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIHNlbGVjdG9yOiAgICcuanMtdmlkZW8taW5pdCcsXG4gICAgICAgICAgICB3cmFwcGVyOiAgICAnanMtdmlkZW8td3JhcCcsXG4gICAgICAgICAgICBidXR0b25zOiB7XG4gICAgICAgICAgICAgICAgcGxheTogICAnLmJ0bi1wbGF5JyxcbiAgICAgICAgICAgICAgICBtdXRlOiAgICcuYnRuLW11dGUnLFxuICAgICAgICAgICAgICAgIGNsb3NlOiAgJy5idG4tY2xvc2UnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xhc3Nlczoge1xuICAgICAgICAgICAgICAgIHBhdXNlOiAgICAgICAgICAgJ2lzLXBhdXNlJyxcbiAgICAgICAgICAgICAgICBwbGF5aW5nOiAgICAgICAgICdpcy1wbGF5aW5nJyxcbiAgICAgICAgICAgICAgICBzb3VuZDogICAgICAgICAgICdpcy1zb3VuZCcsXG4gICAgICAgICAgICAgICAgbXV0ZTogICAgICAgICAgICAnaXMtbXV0ZWQnLFxuICAgICAgICAgICAgICAgIHBhcmVudFBsYXk6ICAgICAgJ2lzLXZpZGVvLXBsYXlpbmcnLFxuICAgICAgICAgICAgICAgIHBhcmVudFBhdXNlOiAgICAgJ2lzLXZpZGVvLXBhdXNlZCcsXG4gICAgICAgICAgICAgICAgdHJpZ2dlckF1dG9wbGF5OiAnanMtdHJpZ2dlci1hdXRvcGxheSdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb250cm9sczogICAgICAgZmFsc2VcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY29uZmlnID0gdV9leHRlbmRPYmplY3QodGhpcy5kZWZhdWx0cywgb3B0aW9ucyApO1xuICAgICAgICB0aGlzLml0ZW1zID0gIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5jb25maWcuc2VsZWN0b3IpO1xuICAgICAgICB0aGlzLmlzUmVtb3ZlZERlY29yYXRpb24gPSBmYWxzZTtcblxuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICBzZWxmLmJpbmRUb2dnbGVQbGF5ID0gdGhpcy50b2dnbGVQbGF5LmJpbmQodGhpcyk7XG4gICAgICAgIHNlbGYuYmluZFRvZ2dsZU11dGUgPSB0aGlzLnRvZ2dsZU11dGUuYmluZCh0aGlzKTtcbiAgICAgICAgc2VsZi5iaW5kRW5kZWRWaWRlbyA9IHRoaXMuZW5kZWRWaWRlby5iaW5kKHRoaXMpO1xuXG4gICAgICAgIFsuLi5zZWxmLml0ZW1zXS5mb3JFYWNoKCh2aWRlbykgPT4ge1xuXG4gICAgICAgICAgICBpZighc2VsZi5jb25maWcuY29udHJvbHMpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmlkZW8uY29udHJvbHMgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IHZpZGVvQ29udGFpbmVyID0gdmlkZW8ucGFyZW50RWxlbWVudDtcbiAgICAgICAgICAgIHZpZGVvQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoc2VsZi5jb25maWcud3JhcHBlcik7XG4gICAgICAgICAgICBsZXQgYnRuUGxheSA9IHZpZGVvQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3Ioc2VsZi5jb25maWcuYnV0dG9ucy5wbGF5KTtcbiAgICAgICAgICAgIGxldCBidG5NdXRlID0gdmlkZW9Db250YWluZXIucXVlcnlTZWxlY3RvcihzZWxmLmNvbmZpZy5idXR0b25zLm11dGUpO1xuXG4gICAgICAgICAgICAvLyBiaW5kIGV2ZW50cyB0byBidXR0b25zXG5cbiAgICAgICAgICAgIGlmKGJ0blBsYXkpIHtcbiAgICAgICAgICAgICAgICBidG5QbGF5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2VsZi5iaW5kVG9nZ2xlUGxheSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKGJ0bk11dGUpIHtcbiAgICAgICAgICAgICAgICBidG5NdXRlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2VsZi5iaW5kVG9nZ2xlTXV0ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGJpbmQgZXZlbnQgdG8gdmlkZW8gaXRzZWxmXG4gICAgICAgICAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKCdlbmRlZCcsIHNlbGYuYmluZEVuZGVkVmlkZW8sIGZhbHNlKTtcblxuICAgICAgICAgICAgaWYgKHZpZGVvLmNsYXNzTGlzdC5jb250YWlucyhzZWxmLmNvbmZpZy5jbGFzc2VzLnRyaWdnZXJBdXRvcGxheSkpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnN0YXJ0UGxheSh2aWRlbyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgZW5kZWRWaWRlbyhldikge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGxldCB2aWRlbyA9IGV2LmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgIGxldCBwYXJlbnRXcmFwID0gdmlkZW8uY2xvc2VzdCgnLicrc2VsZi5jb25maWcud3JhcHBlcik7XG4gICAgICAgIGxldCBidG5QbGF5ID0gcGFyZW50V3JhcC5xdWVyeVNlbGVjdG9yKHNlbGYuY29uZmlnLmJ1dHRvbnMucGxheSk7XG5cbiAgICAgICAgdmlkZW8ucGF1c2UoKTtcbiAgICAgICAgdmlkZW8uY3VycmVudFRpbWUgPSAwO1xuICAgICAgICBidG5QbGF5LmNsYXNzTGlzdC5hZGQoc2VsZi5jb25maWcuY2xhc3Nlcy5wYXVzZSk7XG4gICAgICAgIGJ0blBsYXkuY2xhc3NMaXN0LnJlbW92ZShzZWxmLmNvbmZpZy5jbGFzc2VzLnBsYXlpbmcpO1xuICAgICAgICBwYXJlbnRXcmFwLmNsYXNzTGlzdC5yZW1vdmUoc2VsZi5jb25maWcuY2xhc3Nlcy5wYXJlbnRQbGF5KTtcbiAgICB9XG5cbiAgICB0b2dnbGVQbGF5KGV2KSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IGVsZW0gPSBldi5jdXJyZW50VGFyZ2V0O1xuICAgICAgICBsZXQgcGFyZW50V3JhcCA9IGVsZW0uY2xvc2VzdCgnLicrc2VsZi5jb25maWcud3JhcHBlcik7XG4gICAgICAgIGxldCB2aWRlbyA9IHBhcmVudFdyYXAucXVlcnlTZWxlY3RvcihzZWxmLmNvbmZpZy5zZWxlY3Rvcik7XG5cbiAgICAgICAgaWYgKHZpZGVvLnBhdXNlZCB8fCB2aWRlby5lbmRlZCkge1xuICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKHNlbGYuY29uZmlnLmNsYXNzZXMucGxheWluZyk7XG4gICAgICAgICAgICBwYXJlbnRXcmFwLmNsYXNzTGlzdC5hZGQoc2VsZi5jb25maWcuY2xhc3Nlcy5wYXJlbnRQbGF5KTtcbiAgICAgICAgICAgIHBhcmVudFdyYXAuY2xhc3NMaXN0LnJlbW92ZShzZWxmLmNvbmZpZy5jbGFzc2VzLnBhcmVudFBhdXNlKTtcbiAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShzZWxmLmNvbmZpZy5jbGFzc2VzLnBhdXNlKTtcblxuICAgICAgICAgICAgaWYgKHZpZGVvLmNsb3Nlc3QoJy5tLWFjY29yZGlvbicpICYmIHZpZGVvLmNsb3Nlc3QoJy5tLWFjY29yZGlvbicpLmNsYXNzTGlzdC5jb250YWlucygnaGFzLWRlY29yYXRpb24nKSkge1xuICAgICAgICAgICAgICAgIHZpZGVvLmNsb3Nlc3QoJy5tLWFjY29yZGlvbicpLmNsYXNzTGlzdC5yZW1vdmUoJ2hhcy1kZWNvcmF0aW9uJyk7XG4gICAgICAgICAgICAgICAgc2VsZi5pc1JlbW92ZWREZWNvcmF0aW9uID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZpZGVvLnBsYXkoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChzZWxmLmNvbmZpZy5jbGFzc2VzLnBhdXNlKTtcbiAgICAgICAgICAgIHBhcmVudFdyYXAuY2xhc3NMaXN0LmFkZChzZWxmLmNvbmZpZy5jbGFzc2VzLnBhcmVudFBhdXNlKTtcbiAgICAgICAgICAgIHBhcmVudFdyYXAuY2xhc3NMaXN0LnJlbW92ZShzZWxmLmNvbmZpZy5jbGFzc2VzLnBhcmVudFBsYXkpO1xuICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKHNlbGYuY29uZmlnLmNsYXNzZXMucGxheWluZyk7XG4gICAgICAgICAgICBpZiAoc2VsZi5pc1JlbW92ZWREZWNvcmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgdmlkZW8uY2xvc2VzdCgnLm0tYWNjb3JkaW9uJykuY2xhc3NMaXN0LmFkZCgnaGFzLWRlY29yYXRpb24nKTtcbiAgICAgICAgICAgICAgICBzZWxmLmlzUmVtb3ZlZERlY29yYXRpb24gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZpZGVvLnBhdXNlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0b2dnbGVNdXRlKGV2KSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IGVsZW0gPSBldi5jdXJyZW50VGFyZ2V0O1xuICAgICAgICBsZXQgcGFyZW50V3JhcCA9IGVsZW0uY2xvc2VzdCgnLicrc2VsZi5jb25maWcud3JhcHBlcik7XG4gICAgICAgIGxldCB2aWRlbyA9IHBhcmVudFdyYXAucXVlcnlTZWxlY3RvcihzZWxmLmNvbmZpZy5zZWxlY3Rvcik7XG5cbiAgICAgICAgdmlkZW8ubXV0ZWQgPSAhdmlkZW8ubXV0ZWQ7XG4gICAgICAgIGlmICh2aWRlby5tdXRlZCkge1xuICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKHNlbGYuY29uZmlnLmNsYXNzZXMubXV0ZSk7XG4gICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoc2VsZi5jb25maWcuY2xhc3Nlcy5zb3VuZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoc2VsZi5jb25maWcuY2xhc3Nlcy5zb3VuZCk7XG4gICAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoc2VsZi5jb25maWcuY2xhc3Nlcy5tdXRlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0b3BQbGF5KGVsZW0pIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBsZXQgdmlkZW8gPSBlbGVtO1xuICAgICAgICBsZXQgdmlkZW9Db250YWluZXIgPSB2aWRlby5wYXJlbnRFbGVtZW50O1xuICAgICAgICBsZXQgYnRuUGxheSA9IHZpZGVvQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3Ioc2VsZi5jb25maWcuYnV0dG9ucy5wbGF5KTtcblxuICAgICAgICBpZiAoIXZpZGVvLnBhdXNlZCB8fCAhdmlkZW8uZW5kZWQpIHtcbiAgICAgICAgICAgIGJ0blBsYXkuY2xhc3NMaXN0LmFkZChzZWxmLmNvbmZpZy5jbGFzc2VzLnBhdXNlKTtcbiAgICAgICAgICAgIC8vIHZUYWcucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpcy12aWRlby1wYXVzZWQnKTtcbiAgICAgICAgICAgIGJ0blBsYXkuY2xhc3NMaXN0LnJlbW92ZShzZWxmLmNvbmZpZy5jbGFzc2VzLnBsYXlpbmcpO1xuICAgICAgICAgICAgdmlkZW8ucGF1c2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXJ0UGxheShlbGVtKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IHZpZGVvID0gZWxlbTtcbiAgICAgICAgbGV0IHZpZGVvQ29udGFpbmVyID0gdmlkZW8ucGFyZW50RWxlbWVudDtcbiAgICAgICAgbGV0IGJ0blBsYXkgPSB2aWRlb0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKHNlbGYuY29uZmlnLmJ1dHRvbnMucGxheSk7XG5cbiAgICAgICAgaWYgKHZpZGVvLnBhdXNlZCB8fCB2aWRlby5lbmRlZCkge1xuICAgICAgICAgICAgYnRuUGxheS5jbGFzc0xpc3QuYWRkKHNlbGYuY29uZmlnLmNsYXNzZXMucGxheWluZyk7XG4gICAgICAgICAgICAvKnZUYWcucGFyZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpcy12aWRlby1wbGF5aW5nJyk7XG4gICAgICAgICAgICB2VGFnLnBhcmVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtdmlkZW8tcGF1c2VkJyk7Ki9cbiAgICAgICAgICAgIGJ0blBsYXkuY2xhc3NMaXN0LnJlbW92ZShzZWxmLmNvbmZpZy5jbGFzc2VzLnBhdXNlKTtcbiAgICAgICAgICAgIHZpZGVvLnBsYXkoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRFNNUE1lZGlhQ29udHJvbHM7XG4iLCIvLyBHZXQgcGFnZSBlbGVtZW50cy5cbmNvbnN0IGpvYlR5cGVTZWxlY3QgID0gKCAkKCcuanMtam9iLXR5cGUtc2VsZWN0JykubGVuZ3RoICkgPyAkKCcuanMtam9iLXR5cGUtc2VsZWN0JykgOiBmYWxzZSxcbiAgICBqb2JDYXRTZWxlY3QgICA9ICggJCgnLmpzLWpvYi1jYXQtc2VsZWN0JykubGVuZ3RoICkgPyAkKCcuanMtam9iLWNhdC1zZWxlY3QnKSA6IGZhbHNlLFxuICAgIGpvYkxvY1NlbGVjdCAgID0gKCAkKCcuanMtam9iLWxvYy1zZWxlY3QnKS5sZW5ndGggKSA/ICQoJy5qcy1qb2ItbG9jLXNlbGVjdCcpIDogZmFsc2UsXG4gICAgam9iU2VhcmNoRm9ybSAgPSAoICQoJyNvcGVuaW5nc1NlYXJjaCcpLmxlbmd0aCApID8gJCgnI29wZW5pbmdzU2VhcmNoJykgOiBmYWxzZSxcbiAgICBqb2JTZWFyY2hJbnB1dCA9ICggJCgnI29wZW5pbmdzU2VhcmNoIGlucHV0W3R5cGU9XCJzZWFyY2hcIl0nKS5sZW5ndGggKSA/ICQoJyNvcGVuaW5nc1NlYXJjaCBpbnB1dFt0eXBlPVwic2VhcmNoXCJdJykgOiBmYWxzZSxcbiAgICBsb2FkTW9yZUJ0biAgICA9ICggJCgnLmpzLWxvYWQtbW9yZSBhJykubGVuZ3RoICkgPyAkKCcuanMtbG9hZC1tb3JlIGEnKSA6IGZhbHNlLFxuICAgIG5vdGhpbmdGb3VuZCAgID0gKCAkKCcuanMtbm90aGluZy1mb3VuZCcpLmxlbmd0aCApID8gJCgnLmpzLW5vdGhpbmctZm91bmQnKSA6IGZhbHNlLFxuICAgIG5vX3Jlc3VsdHMgICAgID0gKCAkKCcuanMtc3RvcC1hbGwnKS5sZW5ndGggKSA/IHRydWUgOiBmYWxzZTtcblxuLy8gRGVmaW5lIG9uIHBhZ2Ugc3RhdGUgb2YgdGhlIGl0ZW1zLlxuY29uc3QgcHBwID0gKCAkKCcuanMtb3BlbmluZ3MtY29udGFpbmVyJykuYXR0cignZGF0YS1wcHAnKSApID8gcGFyc2VJbnQoICQoJy5qcy1vcGVuaW5ncy1jb250YWluZXInKS5hdHRyKCdkYXRhLXBwcCcpICkgOiAxMCxcbiAgICBpdGVtc051bSA9ICggJCgnLmpzLW9wZW5pbmdzLWNvbnRhaW5lciAuanMtam9iLWl0ZW0nKS5sZW5ndGggKSA/ICQoJy5qcy1vcGVuaW5ncy1jb250YWluZXIgLmpzLWpvYi1pdGVtJykubGVuZ3RoIDogMCxcbiAgICBpdGVtc1Zpc2libGUgPSAoICQoJy5qcy1vcGVuaW5ncy1jb250YWluZXIgLmpzLWpvYi1pdGVtOnZpc2libGUnKS5sZW5ndGggKSA/ICQoJy5qcy1vcGVuaW5ncy1jb250YWluZXIgLmpzLWpvYi1pdGVtOnZpc2libGUnKS5sZW5ndGggOiAwLFxuICAgIGpvYlR5cGUgPSAoIGpvYlR5cGVTZWxlY3QgKSA/IGpvYlR5cGVTZWxlY3QudmFsKCkgOiAnJyxcbiAgICBqb2JDYXQgPSAoIGpvYkNhdFNlbGVjdCApID8gam9iQ2F0U2VsZWN0LnZhbCgpIDogJycsXG4gICAgam9iTG9jID0gKCBqb2JMb2NTZWxlY3QgKSA/IGpvYkxvY1NlbGVjdC52YWwoKSA6ICcnLFxuICAgIHNlYXJjaCA9ICggam9iU2VhcmNoSW5wdXQgKSA/IGpvYlNlYXJjaElucHV0LnZhbCgpIDogJyc7XG5cblxuLy8gRGVmaW5lIGdsb2JhbCBhcHBsaWNhdGlvbiBzdGF0ZS5cbnZhciBhcHBTdGF0ZSA9IHtcbiAgICAncHBwJyA6IHBwcCxcbiAgICAndG90YWwnIDogaXRlbXNOdW0sXG4gICAgJ3Zpc2libGUnIDogaXRlbXNWaXNpYmxlLFxuICAgICd0eXBlJyA6IGpvYlR5cGUsXG4gICAgJ2NhdCcgOiBqb2JDYXQsXG4gICAgJ2xvYycgOiBqb2JMb2MsXG4gICAgJ3NlYXJjaCcgOiBzZWFyY2gsXG59O1xuXG4vLyBEZWZpbmUgaW5pdGlhbCBhcHBsaWNhdGlvbiBzdGF0ZS5cbmNvbnN0IGFwcFN0YXRlSW5pdGlhbCA9IHtcbiAgICAncHBwJyA6IHBwcCxcbiAgICAndG90YWwnIDogaXRlbXNOdW0sXG4gICAgJ3Zpc2libGUnIDogcHBwLFxuICAgICd0eXBlJyA6ICcnLFxuICAgICdjYXQnIDogJycsXG4gICAgJ2xvYycgOiAnJyxcbiAgICAnc2VhcmNoJyA6ICcnLFxufTtcblxuLy8gU2VhcmNoIGNoZWNrIGlmIHRpdGxlIG1hdGNoZXMgYW55IG9mIHRoZSBzZWFyY2ggd29yZHMuXG5mdW5jdGlvbiBTZWFyY2hUaXRsZSggVGl0bGUsIFNlYXJjaCApIHtcblxuICAgIC8vIFJldHVybiB0cnVlIGlmIHRoZXJlIGlzIG5vIHNlYXJjaCBxdWVyeS5cbiAgICBpZiAoICEgU2VhcmNoICkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBDb252ZXJ0IGJvdGggc3RyaW5ncyB0byBsb3dlcmNhc2UgZm9yIGNhc2UtaW5zZW5zaXRpdmUgY29tcGFyaXNvblxuICAgIGxldCBsb3dlclRpdGxlID0gVGl0bGUudG9Mb3dlckNhc2UoKTtcbiAgICBsZXQgbG93ZXJTZWFyY2ggPSBTZWFyY2gudG9Mb3dlckNhc2UoKTtcbiAgXG4gICAgLy8gU3BsaXQgdGhlIHNlYXJjaCBzdHJpbmcgaW50byBhbiBhcnJheSBvZiB3b3Jkc1xuICAgIGxldCBzZWFyY2hXb3JkcyA9IGxvd2VyU2VhcmNoLnNwbGl0KCcgJyk7XG4gIFxuICAgIC8vIEluaXRpYWxpemUgYSBmbGFnIHRvIGZhbHNlXG4gICAgbGV0IGNvbnRhaW5zU2VhcmNoV29yZCA9IGZhbHNlO1xuICBcbiAgICAvLyBMb29wIHRocm91Z2ggZWFjaCB3b3JkIGluIHRoZSBzZWFyY2hXb3JkcyBhcnJheVxuICAgIGZvciAobGV0IHdvcmQgb2Ygc2VhcmNoV29yZHMpIHtcbiAgICAgIGlmIChsb3dlclRpdGxlLmluY2x1ZGVzKHdvcmQpKSB7XG4gICAgICAgIGNvbnRhaW5zU2VhcmNoV29yZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgXG4gICAgcmV0dXJuIGNvbnRhaW5zU2VhcmNoV29yZDtcbiAgfVxuXG5cbi8vIEZpbHRlcmluZyBmdW5jdGlvbi5cbmZ1bmN0aW9uIGZpbHRlckl0ZW1zKCBhcHBTdGF0ZSApIHtcbiAgICBsZXQgcHBwID0gYXBwU3RhdGUucHBwLFxuICAgICAgICB0b3RhbCA9IGFwcFN0YXRlLnRvdGFsLFxuICAgICAgICB2aXNpYmxlID0gYXBwU3RhdGUudmlzaWJsZSxcbiAgICAgICAgdHlwZSA9ICggYXBwU3RhdGUudHlwZSAmJiAnYWxsJyA9PT0gYXBwU3RhdGUudHlwZS50b0xvd2VyQ2FzZSgpICkgPyAnJyA6IGFwcFN0YXRlLnR5cGUsXG4gICAgICAgIGNhdCA9ICggYXBwU3RhdGUuY2F0ICYmICdhbGwnID09PSBhcHBTdGF0ZS5jYXQudG9Mb3dlckNhc2UoKSApID8gJycgOiBhcHBTdGF0ZS5jYXQsXG4gICAgICAgIGxvYyA9ICggYXBwU3RhdGUubG9jICYmICdhbGwnID09PSBhcHBTdGF0ZS5sb2MudG9Mb3dlckNhc2UoKSApID8gJycgOiBhcHBTdGF0ZS5sb2MsXG4gICAgICAgIHNlYXJjaCA9IGFwcFN0YXRlLnNlYXJjaDtcblxuICAgIC8vIElmIHRvdGFsICYgdmlzaWJsZSBhcmUgbGVzcyB0aGFuIHBwcCwgc2V0IHRoZW0gdG8gYmUgdGhlIHNhbWUgKCB0b3RhbCApXG4gICAgaWYgKCBwcHAgPj0gdmlzaWJsZSAmJiBwcHAgPj0gdG90YWwgKSB7XG4gICAgICAgIHZpc2libGUgPSB0b3RhbDtcbiAgICB9XG5cbiAgICAvLyBIaWRlIGxvYWQgbW9yZSBidXR0b24uXG4gICAgaWYgKCBsb2FkTW9yZUJ0bi5sZW5ndGggKSB7XG4gICAgICAgIGxvYWRNb3JlQnRuLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgICAgIC8vIFVwZGF0ZSBsb2FkIG1vcmUgYnV0dG9uIHZhbHVlcy5cbiAgICAgICAgbG9hZE1vcmVCdG4uYXR0ciggJ2RhdGEtdG90YWwnLCAwICk7XG4gICAgICAgIGxvYWRNb3JlQnRuLmF0dHIoICdkYXRhLXZpc2libGUnLCAwICk7XG4gICAgfVxuICAgIFxuXG4gICAgLy8gRmluZCBpdGVtcyBvbiBhIHBhZ2UuXG4gICAgbGV0IGl0ZW1zQWxsID0gJCgnLmpzLW9wZW5pbmdzLWNvbnRhaW5lciAuanMtam9iLWl0ZW0nKTtcbiAgICBcbiAgICAvLyBMb29wIHRyb3VnaCBpdGVtcy5cbiAgICBpdGVtc0FsbC5lYWNoKCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRoaXNJdGVtID0gJCh0aGlzKSxcbiAgICAgICAgICAgIGl0ZW1UeXBlID0gdGhpc0l0ZW0uYXR0cignZGF0YS10eXBlJyksXG4gICAgICAgICAgICBpdGVtQ2F0ID0gdGhpc0l0ZW0uYXR0cignZGF0YS1jYXQnKSxcbiAgICAgICAgICAgIGl0ZW1Mb2MgPSB0aGlzSXRlbS5hdHRyKCdkYXRhLWxvYycpLFxuICAgICAgICAgICAgaXRlbVRpdGxlID0gdGhpc0l0ZW0uZmluZCgnLmpzLWpvYi1uYW1lJykudGV4dCgpLFxuICAgICAgICAgICAgaXRlbUFjdGl2ZSA9IHRydWU7XG5cbiAgICAgICAgLy8gSGlkZSBhbGwgaXRlbXMgYnkgZGVmYXVsdC5cbiAgICAgICAgdGhpc0l0ZW0uY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcblxuICAgICAgICAvLyBSZXNldCBhY3RpdmUgY2xhc3Mgb24gYWxsIGl0ZW1zLlxuICAgICAgICB0aGlzSXRlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdHlwZXMgbWF0Y2gsIGFuZCBhZGQgYWN0aXZlIGNsYXNzIGlmIHRoZXkgZG8uXG4gICAgICAgIGlmICggdHlwZSAmJiB0eXBlICE9PSBpdGVtVHlwZSApIHtcbiAgICAgICAgICAgIGl0ZW1BY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBDaGVjayBpZiBjYXRzIG1hdGNoLCBhbmQgYWRkIGFjdGl2ZSBjbGFzcyBpZiB0aGV5IGRvLlxuICAgICAgICBpZiAoIGNhdCAmJiBjYXQgIT09IGl0ZW1DYXQgKSB7XG4gICAgICAgICAgICBpdGVtQWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2hlY2sgaWYgbG9jcyBtYXRjaCwgYW5kIGFkZCBhY3RpdmUgY2xhc3MgaWYgdGhleSBkby5cbiAgICAgICAgaWYgKCBsb2MgJiYgbG9jICE9PSBpdGVtTG9jICkge1xuICAgICAgICAgICAgaXRlbUFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIENoZWNrIGlmIHNlYXJjaCB0ZXJtIG1hdGNoZXMgdGhlIHRpdGxlLCBhbmQgYWRkIGFjdGl2ZSBjbGFzcyBpZiB0aGV5IGRvLlxuICAgICAgICBpZiAoIHNlYXJjaCAmJiAhIFNlYXJjaFRpdGxlKCBpdGVtVGl0bGUsIHNlYXJjaCApICkge1xuICAgICAgICAgICAgaXRlbUFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8vIEFkZCBhY3RpdmUgY2xhc3MgaWYgaXRlbSBoYXMgYW55IG9mIHRoZSBmaWx0ZXJpbmcgY29uZGl0aW9ucyBtZXQuXG4gICAgICAgIGlmICggaXRlbUFjdGl2ZSApIHtcbiAgICAgICAgICAgIHRoaXNJdGVtLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gTmV4dCBmaW5kIGFsbCBvZiB0aGUgYWN0aXZlIGl0ZW1zLlxuICAgIGxldCBpdGVtc0FjdGl2ZSA9ICQoJy5qcy1vcGVuaW5ncy1jb250YWluZXIgLmpzLWpvYi1pdGVtLmFjdGl2ZScpLFxuICAgICAgICBpdGVtc0NvdW50ZXIgPSAxO1xuXG4gICAgLy8gSWYgaXRlbXMgYXJlIGFjdGl2ZSwgY2hlY2sgaG93IG11Y2ggaXRlbXMgZG8gd2UgbmVlZCB0byBzaG93LlxuICAgIGlmICggaXRlbXNBY3RpdmUubGVuZ3RoICkge1xuXG4gICAgICAgIC8vIEhpZGUgbm8gcmVzdWx0cyBtZXNzYWdlIGJ5IGRlZmF1bHQsXG4gICAgICAgIC8vIHdlIHdpbGwgc2hvdyBpdCBsYXRlciBpZiBuZWVkZWQuXG4gICAgICAgIG5vdGhpbmdGb3VuZC5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuXG4gICAgICAgIC8vIExvb3AgdHJvdWdoIGFjdGl2ZSBpdGVtcy5cbiAgICAgICAgaXRlbXNBY3RpdmUuZWFjaCggZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBDaGVjayBpZiBpdGVtcyBzaG91bGQgYmUgdmlzaWJsZSBvciBub3QuXG4gICAgICAgICAgICAvLyBWaXNpYmxlIGlzIGRlZmluZWQgYnkgdGhlIGFwcCBzdGF0ZS5cbiAgICAgICAgICAgIGlmICggdmlzaWJsZSA+PSBpdGVtc0NvdW50ZXIgKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICAgICAgICAgICAgICBpdGVtc0NvdW50ZXIrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIFJlc2V0IGNvdW50ZXIganVzdCBpbiBjYXNlLlxuICAgICAgICBpdGVtc0NvdW50ZXIgPSAxO1xuXG4gICAgICAgIC8vIEZpbmQgYWxsIG9mIHRoZSBoaWRkZW4gaXRlbXMuXG4gICAgICAgIGxldCBpdGVtc0FjdGl2ZVZpc2libGUgPSAkKCcuanMtb3BlbmluZ3MtY29udGFpbmVyIC5qcy1qb2ItaXRlbS5hY3RpdmU6dmlzaWJsZScpLmxlbmd0aDtcblxuICAgICAgICAvLyBTZXQgbmV3IHRvdGFsICYgdmlzaWJsZSxcbiAgICAgICAgLy8gYmFzZWQgb24gdGhlIGN1cnJlbnQgdmlzaWJpbGl0eSBvZiB0aGUgaXRlbXMuXG4gICAgICAgIHRvdGFsID0gaXRlbXNBY3RpdmUubGVuZ3RoLFxuICAgICAgICB2aXNpYmxlID0gaXRlbXNBY3RpdmVWaXNpYmxlO1xuXG4gICAgICAgIC8vIElmIHRvdGFsICYgdmlzaWJsZSBhcmUgbGVzcyB0aGFuIHBwcCwgc2V0IHZpc2libGUgdG8gYmUgdGhlIHNhbWUgYXMgdG90YWwuXG4gICAgICAgIGlmICggcHBwID49IHZpc2libGUgJiYgcHBwID49IHRvdGFsICkge1xuICAgICAgICAgICAgdmlzaWJsZSA9IHRvdGFsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgaG93IG11Y2ggaXRlbXMgaGF2ZSB3ZSBzaG93biwgYW5kIHNob3cgXCJMb2FkIE1vcmVcIiBidXR0b24gYWdhaW4sIGlmIG5lZWRlZC5cbiAgICAgICAgaWYgKCBsb2FkTW9yZUJ0bi5sZW5ndGggJiYgdG90YWwgPiB2aXNpYmxlICkge1xuICAgICAgICAgICAgbG9hZE1vcmVCdG4uY3NzKCdkaXNwbGF5JywgJ2lubGluZS1mbGV4Jyk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbm8gYWN0aXZlIGl0ZW1zLCB0aGF0IG1lYW5zIHRoYXQgZmlsdHJhdGlvbiBkaWRuJ3QgcmV0dXJuIHVzIGEgdmFsaWQgcmVzdWx0cy5cbiAgICAgICAgLy8gU2V0IG5ldyB0b3RhbCAmIHZpc2libGUgaXRlbXMuXG4gICAgICAgIHRvdGFsID0gMCxcbiAgICAgICAgdmlzaWJsZSA9IDA7XG4gICAgICAgIC8vIFNob3cgXCJubyByZXN1bHRzXCIgZGl2LlxuICAgICAgICBub3RoaW5nRm91bmQuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gICAgfVxuXG4gICAgLy8gVXBkYXRlIGxvYWQgbW9yZSBidXR0b24gdmFsdWVzLlxuICAgIC8vIExvYWQgbW9yZSBidXR0b24gd2lsbCB1cGRhdGUgYXBwIHN0YXRlIGxhdGVyIG9uLlxuICAgIGxvYWRNb3JlQnRuLmF0dHIoICdkYXRhLXRvdGFsJywgdG90YWwgKTtcbiAgICBsb2FkTW9yZUJ0bi5hdHRyKCAnZGF0YS12aXNpYmxlJywgdmlzaWJsZSApO1xufVxuXG4vLyBSZXNldCBzZWxlY3QgZmllbGRzIHZhbHVlcy5cbmZ1bmN0aW9uIHJlc2V0U2VsZWN0RmllbGRzKCkge1xuICAgIGpvYlR5cGVTZWxlY3QudmFsKCcnKS50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICBqb2JDYXRTZWxlY3QudmFsKCcnKS50cmlnZ2VyKCdjaGFuZ2UnKTtcbiAgICBqb2JMb2NTZWxlY3QudmFsKCcnKS50cmlnZ2VyKCdjaGFuZ2UnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRzX29wZW5pbmdzX2ZpbHRlcnMoKSB7XG5cbiAgICAvLyBCYWlsIGVhbHJ5IGlmIGFueSBvZiB0aGUgaXRlbXMgYXJlIG5vdCBwcmVzZW50LlxuICAgIGlmICggISAoIGpvYlR5cGVTZWxlY3QgfHwgam9iQ2F0U2VsZWN0IHx8IGpvYkxvY1NlbGVjdCB8fCBqb2JTZWFyY2hGb3JtIHx8IGpvYlNlYXJjaElucHV0ICkgKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGVyZSBhcmUgbm8gcmVzdWx0cywgc3RvcCBhbGwuXG4gICAgaWYgKCBub19yZXN1bHRzICkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gT24gam9iIHR5cGUgc2VsZWN0IGNoYW5nZS5cbiAgICBqb2JUeXBlU2VsZWN0Lm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGFwcFN0YXRlLnR5cGUgPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICAkKGRvY3VtZW50KS50cmlnZ2VyKCd1cGRhdGVTdGF0ZScpO1xuICAgIH0pO1xuXG4gICAgLy8gT24gam9iIGNhdGVnb3J5IHNlbGVjdCBjaGFuZ2UuXG4gICAgam9iQ2F0U2VsZWN0Lm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGFwcFN0YXRlLmNhdCA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICQoZG9jdW1lbnQpLnRyaWdnZXIoJ3VwZGF0ZVN0YXRlJyk7XG4gICAgfSk7XG5cbiAgICAvLyBPbiBqb2IgbG9jYXRpb24gc2VsZWN0IGNoYW5nZS5cbiAgICBqb2JMb2NTZWxlY3Qub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgYXBwU3RhdGUubG9jID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgJChkb2N1bWVudCkudHJpZ2dlcigndXBkYXRlU3RhdGUnKTtcbiAgICB9KTtcblxuICAgIC8vIE9uIGpvYiBzZWFyY2ggZm9ybSBzdWJtaXQuXG4gICAgam9iU2VhcmNoRm9ybS5vbiggJ3N1Ym1pdCcsIGZ1bmN0aW9uKCBlICkge1xuICAgICAgICBsZXQgc2VhcmNoVmFsdWUgPSAoICQodGhpcykuZmluZCgnaW5wdXRbdHlwZT1cInNlYXJjaFwiXScpICkgPyAkKHRoaXMpLmZpbmQoJ2lucHV0W3R5cGU9XCJzZWFyY2hcIl0nKS52YWwoKSA6ICcnO1xuICAgICAgICAvLyBSZXNldCBzZWxlY3Rpb24gZmllbGRzLlxuICAgICAgICByZXNldFNlbGVjdEZpZWxkcygpO1xuICAgICAgICAvLyBJZiB0aGVyZSBpcyBubyBzZWFyY2ggdmFsdWUsIHNldCBhcHAgc3RhdGUgdG8gaW5pdGlhbCBzdGF0ZS5cbiAgICAgICAgaWYgKCAhIHNlYXJjaFZhbHVlICkge1xuICAgICAgICAgICAgYXBwU3RhdGUgPSBhcHBTdGF0ZUluaXRpYWw7XG4gICAgICAgICAgICBhcHBTdGF0ZS5zZWFyY2ggPSAnJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFwcFN0YXRlLnNlYXJjaCA9IHNlYXJjaFZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIFVwZGF0ZSBzdGF0ZS5cbiAgICAgICAgJChkb2N1bWVudCkudHJpZ2dlcigndXBkYXRlU3RhdGUnKTtcbiAgICAgICAgLy8gUHJldmVudCBmb3JtIHN1Ym1pc3Npb24uXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuXG4gICAgLy8gT24gam9iIHNlYXJjaCBpbnB1dCBjaGFuZ2UuXG4gICAgam9iU2VhcmNoSW5wdXQub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHNlYXJjaFZhbHVlID0gKCAkKHRoaXMpLnZhbCgpICkgPyAkKHRoaXMpLnZhbCgpIDogJyc7XG4gICAgICAgIC8vIFJlc2V0IHNlbGVjdGlvbiBmaWVsZHMuXG4gICAgICAgIHJlc2V0U2VsZWN0RmllbGRzKCk7XG4gICAgICAgIC8vIElmIHRoZXJlIGlzIG5vIHNlYXJjaCB2YWx1ZSwgc2V0IGFwcCBzdGF0ZSB0byBpbml0aWFsIHN0YXRlLlxuICAgICAgICBpZiAoICEgc2VhcmNoVmFsdWUgKSB7XG4gICAgICAgICAgICBhcHBTdGF0ZSA9IGFwcFN0YXRlSW5pdGlhbDtcbiAgICAgICAgICAgIGFwcFN0YXRlLnNlYXJjaCA9ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXBwU3RhdGUuc2VhcmNoID0gc2VhcmNoVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgJChkb2N1bWVudCkudHJpZ2dlcigndXBkYXRlU3RhdGUnKTtcbiAgICB9KTtcblxuICAgIC8vIE9uIGxvYWQgbW9yZSBidXR0b24gY2xpY2suXG4gICAgaWYgKCBsb2FkTW9yZUJ0bi5sZW5ndGggKSB7XG4gICAgICAgIGxvYWRNb3JlQnRuLm9uKCAnY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBsZXQgdGhpc0l0ZW0gPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgIHRvdGFsSXRlbXMgPSAoIHRoaXNJdGVtLmF0dHIoJ2RhdGEtdG90YWwnKSApID8gcGFyc2VJbnQoIHRoaXNJdGVtLmF0dHIoJ2RhdGEtdG90YWwnKSApIDogMCxcbiAgICAgICAgICAgICAgICB2aXNpYmxlSXRlbXMgPSAoIHRoaXNJdGVtLmF0dHIoJ2RhdGEtdmlzaWJsZScpICkgPyBwYXJzZUludCggdGhpc0l0ZW0uYXR0cignZGF0YS12aXNpYmxlJykgKSA6IDA7XG5cbiAgICAgICAgICAgIC8vIFNldCBuZXcgdmlzaWJsZSBpdGVtc1xuICAgICAgICAgICAgdmlzaWJsZUl0ZW1zID0gYXBwU3RhdGUucHBwICsgdmlzaWJsZUl0ZW1zO1xuXG4gICAgICAgICAgICAvLyBJZiB0aGUgbWF4IHZhbHVlIGlzIHJlYWNoZWQsIHNldCBpdCB0byBtYXguXG4gICAgICAgICAgICBpZiAoIHZpc2libGVJdGVtcyA+IHRvdGFsSXRlbXMgKSB7XG4gICAgICAgICAgICAgICAgdmlzaWJsZUl0ZW1zID0gdG90YWxJdGVtcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIFVwZGF0ZSBzdGF0ZS5cbiAgICAgICAgICAgIGFwcFN0YXRlLnRvdGFsID0gdG90YWxJdGVtcztcbiAgICAgICAgICAgIGFwcFN0YXRlLnZpc2libGUgPSB2aXNpYmxlSXRlbXM7XG4gICAgICAgICAgICAkKGRvY3VtZW50KS50cmlnZ2VyKCd1cGRhdGVTdGF0ZScpO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBPbiBzdGF0ZSB1cGRhdGUsIHJ1biBmaWx0ZXJpbmcuXG4gICAgJChkb2N1bWVudCkub24oICd1cGRhdGVTdGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICBmaWx0ZXJJdGVtcyhhcHBTdGF0ZSk7XG4gICAgfSk7XG59XG4iLCJjb25zdCBub3RoaW5nX2ZvdW5kID0gKHNlYXJjaCkgPT4gYDxkaXYgY2xhc3M9XCJub3RoaW5nLWZvdW5kXCI+U29ycnksIHdlIGNvdWxkbid0IGZpbmQgYW55dGhpbmcgJHtzZWFyY2ggPyBgd2l0aCDigJ0ke3NlYXJjaH3igJ1gIDogJyd9PC9kaXY+YDtcblxuZnVuY3Rpb24gZHNfZGF0YV9zaGVldCgpIHtcbiAgICAkKCcuanMtc2hlZXRzLWxhbmd1YWdlLXNlbGVjdCcpLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIGxldCBzaGVldExhbmcgPSAkKCcuanMtc2hlZXRzLWxhbmd1YWdlLXNlbGVjdCcpLnZhbCgpO1xuICAgICAgICBpZiAoIXNoZWV0TGFuZykge1xuICAgICAgICAgICAgc2hlZXRMYW5nID0gJ2FsbCc7XG4gICAgICAgIH1cbiAgICAgICAgZGF0YVNoZWV0QWpheChzaGVldExhbmcsICcnKTtcbiAgICAgICAgJCgnI2RhdGFfc2hlZXRzLXNlYXJjaCcpLnZhbCgnJyk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBkYXRhU2hlZXRTZWFyY2goKSB7XG4gICAgJCgnI2RhdGFTaGVldFNlYXJjaCcpLm9uKCdzdWJtaXQnLCAoZXYpID0+IHtcbiAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3Qgc2VhcmNoID0gJCgnI2RhdGFfc2hlZXRzLXNlYXJjaCcpLnZhbCgpO1xuICAgICAgICBkYXRhU2hlZXRBamF4KCdhbGwnLCBzZWFyY2gpO1xuICAgICAgICAkKCcuanMtc2hlZXRzLWxhbmd1YWdlLXNlbGVjdCcpLnZhbCgnJyk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiBkYXRhU2hlZXRBamF4KHNoZWV0TGFuZywgc2VhcmNoKSB7XG4gICAgY29uc3QgYWpheERhdGEgPSB7XG4gICAgICAgIGFjdGlvbjogJ2dldF9maWx0ZXJlZF9yZXNvdXJjZXMnLFxuICAgICAgICBzaGVldExhbmcsXG4gICAgICAgIHNlYXJjaCxcbiAgICB9O1xuXG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIHVybDogZHMuYWpheF91cmwsXG4gICAgICAgIGRhdGE6IGFqYXhEYXRhLFxuICAgICAgICBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhLmRhdGFzaGVldHMpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLWRhdGEtc2hlZXRzLWxpc3QnKS5odG1sKHJlc3BvbnNlLmRhdGEuZGF0YXNoZWV0cyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmpzLWRhdGEtc2hlZXRzLWxpc3QnKS5odG1sKG5vdGhpbmdfZm91bmQoc2VhcmNoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH0pO1xufVxuZnVuY3Rpb24gZHNfYnJvY2h1cmUoKSB7XG4gICAgJCgnLmpzLWJyb2NodXJlcy1yZWdpb25zLXNlbGVjdCcpLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIGxldCBicm9jaHVyZVJlZ2lvbiA9ICQoJy5qcy1icm9jaHVyZXMtcmVnaW9ucy1zZWxlY3QnKS52YWwoKTtcbiAgICAgICAgbGV0IGJyb2NodXJlTGFuZyA9ICQoJy5qcy1icm9jaHVyZXMtbGFuZ3VhZ2VzLXNlbGVjdCcpLnZhbCgpO1xuICAgICAgICBpZiAoIWJyb2NodXJlUmVnaW9uKSB7XG4gICAgICAgICAgICBicm9jaHVyZVJlZ2lvbiA9ICdhbGwnO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYnJvY2h1cmVMYW5nKSB7XG4gICAgICAgICAgICBicm9jaHVyZUxhbmcgPSAnYWxsJztcbiAgICAgICAgfVxuICAgICAgICBicm9jaHVyZUFqYXgoYnJvY2h1cmVSZWdpb24sIGJyb2NodXJlTGFuZywgJycpO1xuICAgICAgICAkKCcjYnJvY2h1cmVzLXNlYXJjaCcpLnZhbCgnJyk7XG4gICAgfSk7XG4gICAgJCgnLmpzLWJyb2NodXJlcy1sYW5ndWFnZXMtc2VsZWN0Jykub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgICAgbGV0IGJyb2NodXJlUmVnaW9uID0gJCgnLmpzLWJyb2NodXJlcy1yZWdpb25zLXNlbGVjdCcpLnZhbCgpO1xuICAgICAgICBsZXQgYnJvY2h1cmVMYW5nID0gJCgnLmpzLWJyb2NodXJlcy1sYW5ndWFnZXMtc2VsZWN0JykudmFsKCk7XG4gICAgICAgIGlmICghYnJvY2h1cmVSZWdpb24pIHtcbiAgICAgICAgICAgIGJyb2NodXJlUmVnaW9uID0gJ2FsbCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFicm9jaHVyZUxhbmcpIHtcbiAgICAgICAgICAgIGJyb2NodXJlTGFuZyA9ICdhbGwnO1xuICAgICAgICB9XG4gICAgICAgIGJyb2NodXJlQWpheChicm9jaHVyZVJlZ2lvbiwgYnJvY2h1cmVMYW5nLCAnJyk7XG4gICAgICAgICQoJyNicm9jaHVyZXMtc2VhcmNoJykudmFsKCcnKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGJyb2NodXJlU2VhcmNoKCkge1xuICAgICQoJyNicm9jaHVyZXNTZWFyY2gnKS5vbignc3VibWl0JywgKGV2KSA9PiB7XG4gICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IHNlYXJjaCA9ICQoJyNicm9jaHVyZXMtc2VhcmNoJykudmFsKCk7XG4gICAgICAgIGJyb2NodXJlQWpheCgnYWxsJywgJ2FsbCcsIHNlYXJjaCk7XG4gICAgICAgICQoJy5qcy1icm9jaHVyZXMtcmVnaW9ucy1zZWxlY3QnKS52YWwoJycpO1xuICAgICAgICAkKCcuanMtYnJvY2h1cmVzLWxhbmd1YWdlcy1zZWxlY3QnKS52YWwoJycpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gYnJvY2h1cmVBamF4KGJyb2NodXJlUmVnaW9uLCBicm9jaHVyZUxhbmcsIHNlYXJjaCkge1xuICAgIGNvbnN0IGFqYXhEYXRhID0ge1xuICAgICAgICBhY3Rpb246ICdnZXRfZmlsdGVyZWRfcmVzb3VyY2VzJyxcbiAgICAgICAgYnJvY2h1cmVSZWdpb24sXG4gICAgICAgIGJyb2NodXJlTGFuZyxcbiAgICAgICAgc2VhcmNoLFxuICAgIH07XG4gICAgalF1ZXJ5LmFqYXgoe1xuICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgIHVybDogZHMuYWpheF91cmwsXG4gICAgICAgIGRhdGE6IGFqYXhEYXRhLFxuICAgICAgICBzdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5kYXRhLmJyb2NodXJlcykge1xuICAgICAgICAgICAgICAgICAgICAkKCcuanMtYnJvY2h1cmVzLWxpc3QnKS5odG1sKHJlc3BvbnNlLmRhdGEuYnJvY2h1cmVzKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKCcuanMtYnJvY2h1cmVzLWxpc3QnKS5odG1sKG5vdGhpbmdfZm91bmQoc2VhcmNoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgIH0pO1xufVxuZnVuY3Rpb24gZHNfdmlkZW9zKCkge1xuICAgICQoJy5qcy12aWRlb3MtcmVnaW9ucy1zZWxlY3QnKS5vbignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgICBsZXQgdmlkZW9zUmVnaW9uID0gJCgnLmpzLXZpZGVvcy1yZWdpb25zLXNlbGVjdCcpLnZhbCgpO1xuICAgICAgICBsZXQgdmlkZW9zTGFuZ3VhZ2UgPSAkKCcuanMtdmlkZW9zLWxhbmd1YWdlcy1zZWxlY3QnKS52YWwoKTtcbiAgICAgICAgaWYgKCF2aWRlb3NSZWdpb24pIHtcbiAgICAgICAgICAgIHZpZGVvc1JlZ2lvbiA9ICdhbGwnO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdmlkZW9zTGFuZ3VhZ2UpIHtcbiAgICAgICAgICAgIHZpZGVvc0xhbmd1YWdlID0gJ2FsbCc7XG4gICAgICAgIH1cbiAgICAgICAgdmlkZW9BamF4KHZpZGVvc1JlZ2lvbiwgdmlkZW9zTGFuZ3VhZ2UsICcnKTtcbiAgICAgICAgJCgnI3ZpZGVvcy1zZWFyY2gnKS52YWwoJycpO1xuICAgIH0pO1xuICAgICQoJy5qcy12aWRlb3MtbGFuZ3VhZ2VzLXNlbGVjdCcpLm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIGxldCB2aWRlb3NSZWdpb24gPSAkKCcuanMtdmlkZW9zLXJlZ2lvbnMtc2VsZWN0JykudmFsKCk7XG4gICAgICAgIGxldCB2aWRlb3NMYW5ndWFnZSA9ICQoJy5qcy12aWRlb3MtbGFuZ3VhZ2VzLXNlbGVjdCcpLnZhbCgpO1xuICAgICAgICBpZiAoIXZpZGVvc1JlZ2lvbikge1xuICAgICAgICAgICAgdmlkZW9zUmVnaW9uID0gJ2FsbCc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2aWRlb3NMYW5ndWFnZSkge1xuICAgICAgICAgICAgdmlkZW9zTGFuZ3VhZ2UgPSAnYWxsJztcbiAgICAgICAgfVxuICAgICAgICB2aWRlb0FqYXgodmlkZW9zUmVnaW9uLCB2aWRlb3NMYW5ndWFnZSwgJycpO1xuICAgICAgICAkKCcjdmlkZW9zLXNlYXJjaCcpLnZhbCgnJyk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiB2aWRlb3NTZWFyY2goKSB7XG4gICAgJCgnI3ZpZGVvc1NlYXJjaCcpLm9uKCdzdWJtaXQnLCAoZXYpID0+IHtcbiAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3Qgc2VhcmNoID0gJCgnI3ZpZGVvcy1zZWFyY2gnKS52YWwoKTtcbiAgICAgICAgdmlkZW9BamF4KCdhbGwnLCAnYWxsJywgc2VhcmNoKTtcbiAgICAgICAgJCgnLmpzLXZpZGVvcy1yZWdpb25zLXNlbGVjdCcpLnZhbCgnJyk7XG4gICAgICAgICQoJy5qcy12aWRlb3MtbGFuZ3VhZ2VzLXNlbGVjdCcpLnZhbCgnJyk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiB2aWRlb0FqYXgodmlkZW9zUmVnaW9uLCB2aWRlb3NMYW5ndWFnZSwgc2VhcmNoKSB7XG4gICAgY29uc3QgYWpheERhdGEgPSB7XG4gICAgICAgIGFjdGlvbjogJ2dldF9maWx0ZXJlZF9yZXNvdXJjZXMnLFxuICAgICAgICB2aWRlb3NSZWdpb24sXG4gICAgICAgIHZpZGVvc0xhbmd1YWdlLFxuICAgICAgICBzZWFyY2gsXG4gICAgfTtcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgdXJsOiBkcy5hamF4X3VybCxcbiAgICAgICAgZGF0YTogYWpheERhdGEsXG4gICAgICAgIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmRhdGEudmlkZW9zKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy12aWRlb3MtbGlzdCcpLmh0bWwocmVzcG9uc2UuZGF0YS52aWRlb3MpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5qcy12aWRlb3MtbGlzdCcpLmh0bWwobm90aGluZ19mb3VuZChzZWFyY2gpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZHNfcmVzb3VyY2VzX2RhdGEoKSB7XG4gICAgZHNfZGF0YV9zaGVldCgpO1xuICAgIGRhdGFTaGVldFNlYXJjaCgpO1xuICAgIGRzX2Jyb2NodXJlKCk7XG4gICAgYnJvY2h1cmVTZWFyY2goKTtcbiAgICBkc192aWRlb3MoKTtcbiAgICB2aWRlb3NTZWFyY2goKTtcbn1cbiIsImltcG9ydCB7IGlzQXV0b1BsYXlPbiB9IGZyb20gXCIuL3NsaWRlci1vcHRpb25zL2F1dG9wbGF5XCI7XG5pbXBvcnQgeyBpc0xhenlMb2FkT24gfSBmcm9tIFwiLi9zbGlkZXItb3B0aW9ucy9sYXp5XCI7XG5pbXBvcnQgU3dpcGVyV2l0aFRhYnMgZnJvbSBcIi4vc3dpcGVyLXdpdGgtdGFic1wiO1xuaW1wb3J0IHsgdV90aHJvdHRsZWQgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdXRpbHNcIjtcbmltcG9ydCB7IGlzTmF2aWdhdGlvbk9uIH0gZnJvbSBcIi4vc2xpZGVyLW9wdGlvbnMvbmF2aWdhdGlvblwiO1xuaW1wb3J0IHsgdV9wYXJzZUJvb2wgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdV90eXBlc1wiO1xuaW1wb3J0IHsgaXNMb29wT24gfSBmcm9tIFwiLi9zbGlkZXItb3B0aW9ucy9sb29wXCI7XG5cbmNsYXNzIERTTVBTbGlkZXJEU0JMUyB7XG4gICAgY29uc3RydWN0b3Ioc2xpZGVySUQpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zRGVza3RvcCA9IHt9O1xuICAgICAgICB0aGlzLm9wdGlvbnNNb2JpbGUgPSB7XG4gICAgICAgICAgICBzbGlkZUNsYXNzOiAnanMtZHNibHMtbmF2LWl0ZW0nLFxuICAgICAgICAgICAgcGFnaW5hdGlvbjoge1xuICAgICAgICAgICAgICAgIGVsOiAnLmwtc2xpZGVyLW5hdl9fcGFnaW5hdGlvbicsXG4gICAgICAgICAgICAgICAgY2xpY2thYmxlOiB0cnVlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5vcHRpb25zTmF2ID0ge1xuICAgICAgICAgICAgaXRlbTogJy5qcy1kc2Jscy1uYXYtaXRlbScsXG4gICAgICAgICAgICBhY3RpdmU6ICdpcy1hY3RpdmUnLFxuICAgICAgICAgICAgdHJpZ2dlcjogJ21vdXNlb3ZlcicsXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5zbGlkZXJObyA9IHNsaWRlcklELnJlcGxhY2UoJ2pzLXNsaWRlci1kc2Jscy0nLCAnJyk7XG4gICAgICAgIHRoaXMuc2xpZGVyTmFtZSA9IHNsaWRlcklEO1xuICAgICAgICB0aGlzLnNsaWRlck1vYmlsZU5hbWUgPSBzbGlkZXJJRC5yZXBsYWNlKCdqcy1zbGlkZXItZHNibHMtJywgJ2pzLXNsaWRlci1kc2Jscy1tLScpO1xuXG4gICAgICAgIHRoaXMuc2xpZGVyU2VsID0gYCMkeyB0aGlzLnNsaWRlck5hbWUgfWA7XG4gICAgICAgIHRoaXMuc2xpZGVyTW9iaWxlU2VsID0gYCMkeyB0aGlzLnNsaWRlck1vYmlsZU5hbWUgfWA7XG4gICAgICAgIHRoaXMub3B0aW9uc05hdi5lbGVtZW50ID0gdGhpcy5zbGlkZXJNb2JpbGVTZWw7XG5cbiAgICAgICAgdGhpcy5zbGlkZXJFbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLnNsaWRlclNlbCk7XG4gICAgICAgIHRoaXMuc2xpZGVyTW9iaWxlRWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5zbGlkZXJNb2JpbGVTZWwpO1xuXG4gICAgICAgIHRoaXMuc2hvd01vYmlsZSA9IHVfcGFyc2VCb29sKHRoaXMuc2xpZGVyRWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2xpZGVyLWlzLW1vYmlsZScpKTtcbiAgICAgICAgdGhpcy5vcHRpb25zTmF2LnRyaWdnZXIgPSB0aGlzLnNsaWRlckVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXNsaWRlci10cmlnZ2VyJykgfHwgJ21vdXNlb3Zlcic7XG5cbiAgICAgICAgdGhpcy5pc01vYmlsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzRGVza3RvcCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuZGVza3RvcEluc3RhbmNlO1xuICAgICAgICB0aGlzLm1vYmlsZUluc3RhbmNlO1xuICAgICAgICB0aGlzLmRlc2t0b3BUYWJzO1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IGN1cnJlbnRXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICBsZXQgYnJlYWtwb2ludCA9IDExMTI7XG5cbiAgICAgICAgY3VycmVudFdpZHRoIDwgYnJlYWtwb2ludCA/IHNlbGYuaXNNb2JpbGUgPSB0cnVlIDogc2VsZi5pc0Rlc2t0b3AgPSB0cnVlO1xuXG4gICAgICAgIHNlbGYucGFyc2VPcHRpb25zKCk7XG5cbiAgICAgICAgaWYgKHNlbGYuaXNNb2JpbGUgJiYgc2VsZi5zaG93TW9iaWxlKSBzZWxmLmNyZWF0ZU1vYmlsZSgpO1xuICAgICAgICBpZiAoc2VsZi5pc0Rlc2t0b3ApIHNlbGYuY3JlYXRlRGVza3RvcCgpO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XG4gICAgICAgICAgICBzZWxmLnRocm90dGxlUmVzaXplKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNlbGYudGhyb3R0bGVSZXNpemUgPSB1X3Rocm90dGxlZCgoKSA9PiB7XG4gICAgICAgICAgICBzZWxmLnJlc2l6ZVNsaWRlcigpO1xuICAgICAgICB9LCAzNTApO1xuICAgIH1cblxuICAgIHBhcnNlT3B0aW9ucygpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGlmIChzZWxmLmlzTW9iaWxlICYmIHNlbGYuc2hvd01vYmlsZSkge1xuICAgICAgICAgICAgbGV0IGJhc2VuYW1lID0gc2VsZi5zbGlkZXJNb2JpbGVOYW1lO1xuICAgICAgICAgICAgc2VsZi5vcHRpb25zTW9iaWxlID0gaXNMb29wT24oc2VsZi5zbGlkZXJNb2JpbGVFbGVtLCBzZWxmLm9wdGlvbnNNb2JpbGUpO1xuICAgICAgICAgICAgc2VsZi5vcHRpb25zTW9iaWxlID0gaXNBdXRvUGxheU9uKHNlbGYuc2xpZGVyTW9iaWxlRWxlbSwgc2VsZi5vcHRpb25zTW9iaWxlKTtcbiAgICAgICAgICAgIHNlbGYub3B0aW9uc01vYmlsZSA9IGlzTGF6eUxvYWRPbihzZWxmLnNsaWRlck1vYmlsZUVsZW0sIHNlbGYub3B0aW9uc01vYmlsZSk7XG5cbiAgICAgICAgICAgIC8vIC5tLXNsaWRlciBwYXJlbnQgaXMgaGFyZGNvZGVkIGluIGlzTmF2aWdhdGlvbk9uIG9wdGlvbnNcbiAgICAgICAgICAgIHNlbGYub3B0aW9uc01vYmlsZSA9IGlzTmF2aWdhdGlvbk9uKHNlbGYuc2xpZGVyTW9iaWxlRWxlbSwgc2VsZi5vcHRpb25zTW9iaWxlLCBiYXNlbmFtZSwgc2VsZi5zbGlkZXJObyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VsZi5pc0Rlc2t0b3ApIHtcbiAgICAgICAgICAgIGxldCBiYXNlbmFtZSA9IHNlbGYuc2xpZGVyTmFtZTtcbiAgICAgICAgICAgIHNlbGYub3B0aW9uc0Rlc2t0b3AgPSBpc0xvb3BPbihzZWxmLnNsaWRlckVsZW0sIHNlbGYub3B0aW9uc0Rlc2t0b3ApO1xuICAgICAgICAgICAgc2VsZi5vcHRpb25zRGVza3RvcCA9IGlzQXV0b1BsYXlPbihzZWxmLnNsaWRlckVsZW0sIHNlbGYub3B0aW9uc0Rlc2t0b3ApO1xuICAgICAgICAgICAgc2VsZi5vcHRpb25zRGVza3RvcCA9IGlzTGF6eUxvYWRPbihzZWxmLnNsaWRlckVsZW0sIHNlbGYub3B0aW9uc0Rlc2t0b3ApO1xuXG4gICAgICAgICAgICAvLyAubS1zbGlkZXIgcGFyZW50IGlzIGhhcmRjb2RlZCBpbiBpc05hdmlnYXRpb25PbiBvcHRpb25zXG4gICAgICAgICAgICBzZWxmLm9wdGlvbnNEZXNrdG9wID0gaXNOYXZpZ2F0aW9uT24oc2VsZi5zbGlkZXJFbGVtLCBzZWxmLm9wdGlvbnNEZXNrdG9wLCBiYXNlbmFtZSwgc2VsZi5zbGlkZXJObyk7XG5cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZURlc2t0b3AoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5kZXNrdG9wSW5zdGFuY2UgPSBuZXcgU3dpcGVyKHNlbGYuc2xpZGVyU2VsLCBzZWxmLm9wdGlvbnNEZXNrdG9wKTtcbiAgICAgICAgaWYgKHNlbGYuZGVza3RvcEluc3RhbmNlLmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICBzZWxmLmRlc2t0b3BUYWJzID0gbmV3IFN3aXBlcldpdGhUYWJzKHNlbGYuZGVza3RvcEluc3RhbmNlLCBzZWxmLm9wdGlvbnNOYXYpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlTW9iaWxlKCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNlbGYubW9iaWxlSW5zdGFuY2UgPSBuZXcgU3dpcGVyKHNlbGYuc2xpZGVyTW9iaWxlU2VsLCBzZWxmLm9wdGlvbnNNb2JpbGUpO1xuICAgIH1cblxuICAgIHJlc2l6ZVNsaWRlcigpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBsZXQgbmV3V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgbGV0IGJyZWFrcG9pbnQgPSAxMTEyO1xuICAgICAgICBpZiAobmV3V2lkdGggPCBicmVha3BvaW50KSB7XG4gICAgICAgICAgICBpZiAoIXNlbGYuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNlbGYuZGVza3RvcEluc3RhbmNlICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGVza3RvcFRhYnMudW5iaW5kVGFicygpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmRlc2t0b3BJbnN0YW5jZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGVza3RvcEluc3RhbmNlID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzZWxmLnNob3dNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jcmVhdGVNb2JpbGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZi5pc0Rlc2t0b3AgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBzZWxmLmlzTW9iaWxlID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghc2VsZi5pc0Rlc2t0b3ApIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNlbGYubW9iaWxlSW5zdGFuY2UgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5tb2JpbGVJbnN0YW5jZS5kZXN0cm95KCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubW9iaWxlSW5zdGFuY2UgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc2VsZi5jcmVhdGVEZXNrdG9wKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5pc01vYmlsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHNlbGYuaXNEZXNrdG9wID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRFNNUFNsaWRlckRTQkxTO1xuIiwiLyoqXG4gKiBBdXRvUGxheSBTbGlkZXIgT3B0aW9uc1xuICovXG5cbmNvbnN0IGlzQXV0b1BsYXlPbiA9IChlbGVtLCBvcHRpb25zKSA9PiB7XG4gICAgaWYgKCFlbGVtKSByZXR1cm4gb3B0aW9ucztcblxuICAgIGNvbnN0IGlzQXV0b3BsYXkgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1zbGlkZXItYXV0b3BsYXknKTtcbiAgICBjb25zdCBpc0F1dG9wbGF5RGVsYXkgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1zbGlkZXItYXV0b3BsYXktZGVsYXknKTtcblxuICAgIGlmIChpc0F1dG9wbGF5ID09PSAndHJ1ZScpIHtcbiAgICAgICAgb3B0aW9ucy5hdXRvcGxheSA9IHt9O1xuICAgICAgICBvcHRpb25zLmF1dG9wbGF5LmRpc2FibGVPbkludGVyYWN0aW9uID0gZmFsc2U7XG4gICAgICAgIG9wdGlvbnMuYXV0b3BsYXkuZGVsYXkgPSBpc0F1dG9wbGF5RGVsYXkgPyBwYXJzZUludChpc0F1dG9wbGF5RGVsYXksIDEwKSA6IDMwMDA7XG4gICAgfVxuXG4gICAgY29uc3QgaXNTcGVlZE9uID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2xpZGVyLWF1dG9wbGF5LXNwZWVkJyk7XG5cbiAgICBpZiAoaXNTcGVlZE9uKSB7XG4gICAgICAgIG9wdGlvbnMuc3BlZWQgPSBwYXJzZUludChpc1NwZWVkT24sIDEwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9ucztcbn07XG5cbmV4cG9ydCB7XG4gICAgaXNBdXRvUGxheU9uLFxufTtcbiIsIi8qKlxuICogQXV0b3BsYXkgb25seSB3aGVuIGluIHZpZXdwb3J0XG4gKi9cblxuY29uc3QgYXV0b3BsYXlPYnNlcnZlciA9IChpdGVtcywgbmFtZSwgc2xpZGVycykgPT4ge1xuICAgIGNvbnN0IG9ic2VydmVyQ2FsbGJhY2sgPSAoZW50cmllcykgPT4ge1xuICAgICAgICBlbnRyaWVzLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc0luZGV4ID0gcGFyc2VJbnQoZW50cnkudGFyZ2V0LmdldEF0dHJpYnV0ZSgnaWQnKS5yZXBsYWNlKGAke25hbWV9LWAsICcnKSwgMTApO1xuICAgICAgICAgICAgaWYgKGVudHJ5LmludGVyc2VjdGlvblJhdGlvID4gMCkge1xuICAgICAgICAgICAgICAgIHNsaWRlcnNbc0luZGV4XS5hdXRvcGxheS5zdGFydCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzbGlkZXJzW3NJbmRleF0uYXV0b3BsYXkuc3RvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIob2JzZXJ2ZXJDYWxsYmFjayk7XG5cbiAgICBpdGVtcy5mb3JFYWNoKChvYnNlcnZlKSA9PiB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke29ic2VydmUuc2xpZGVyfWApO1xuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKHRhcmdldCk7XG4gICAgfSk7XG59O1xuXG5leHBvcnQge1xuICAgIGF1dG9wbGF5T2JzZXJ2ZXIsXG59O1xuIiwiLyoqXG4gKiBCcmVhayBQb2ludHMgT3B0aW9uc1xuICovXG5cbmNvbnN0IGlzQnJlYWtwb2ludHNPbiA9IChlbGVtLCBvcHRpb25zKSA9PiB7XG4gICAgaWYgKCFlbGVtKSByZXR1cm4gb3B0aW9ucztcblxuICAgIGNvbnN0IGNvbHVtbnNTdHIgPSBlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1zbGlkZXItY29sdW1ucycpO1xuICAgIGNvbnN0IG5vQ29sdW1ucyA9IGNvbHVtbnNTdHIuaW5kZXhPZignLicpID49IDAgPyBwYXJzZUZsb2F0KGNvbHVtbnNTdHIpIDogcGFyc2VJbnQoY29sdW1uc1N0ciwgMTApO1xuICAgIGNvbnN0IGNvbHVtbnNHYXAgPSBwYXJzZUludChlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1zbGlkZXItY29sdW1ucy1nYXAnKSwgMTApIHx8IDMwO1xuICAgIGNvbnN0IGZvcmNlQ29sdW1uc0dhcCA9IGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXNsaWRlci1mb3JjZS1jb2x1bW5zLWdhcCcpID09ICcxJztcblxuICAgIGlmIChub0NvbHVtbnMpIHtcbiAgICAgICAgb3B0aW9ucy5zbGlkZXNQZXJWaWV3ID0gbm9Db2x1bW5zO1xuICAgICAgICBvcHRpb25zLmJyZWFrcG9pbnRzID0ge1xuICAgICAgICAgICAgMzIwOiB7XG4gICAgICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogMSxcbiAgICAgICAgICAgICAgICBzcGFjZUJldHdlZW46IGZvcmNlQ29sdW1uc0dhcCA/IGNvbHVtbnNHYXAgOiAyMCxcbiAgICAgICAgICAgICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdidWxsZXRzJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgLy8gNTc2OiB7XG4gICAgICAgICAgICAvLyAgICAgc2xpZGVzUGVyVmlldzogbm9Db2x1bW5zID4gMyA/IDIgOiAxLFxuICAgICAgICAgICAgLy8gICAgIHNwYWNlQmV0d2VlbjogMjAsXG4gICAgICAgICAgICAvLyB9LFxuXG4gICAgICAgICAgICAxMDI0OiB7XG4gICAgICAgICAgICAgICAgc2xpZGVzUGVyVmlldzogbm9Db2x1bW5zLFxuICAgICAgICAgICAgICAgIHNwYWNlQmV0d2VlbjogY29sdW1uc0dhcCxcbiAgICAgICAgICAgICAgICBwYWdpbmF0aW9uOiBvcHRpb25zLnBhZ2luYXRpb24sXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBvcHRpb25zO1xufTtcblxuZXhwb3J0IHtcbiAgICBpc0JyZWFrcG9pbnRzT24sXG59O1xuIiwiY29uc3QgaXNFZmZlY3RPbiA9IChlbGVtLCBvcHRpb25zKSA9PiB7XG4gICAgaWYgKCFlbGVtKSByZXR1cm4gb3B0aW9ucztcblxuICAgIGNvbnN0IGlzRWZmZWN0ID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2xpZGVyLWVmZmVjdC10cmFuc2l0aW9uJyk7XG5cbiAgICBvcHRpb25zLmVmZmVjdCA9IHt9O1xuICAgIHN3aXRjaCAoaXNFZmZlY3QpIHtcblxuICAgICAgICBjYXNlICdmYWRlJzpcbiAgICAgICAgICAgIG9wdGlvbnMuZWZmZWN0ID0gJ2ZhZGUnO1xuICAgICAgICAgICAgb3B0aW9ucy5mYWRlRWZmZWN0ID0ge307XG4gICAgICAgICAgICBvcHRpb25zLmZhZGVFZmZlY3QuY3Jvc3NGYWRlID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjdWJlJzpcbiAgICAgICAgICAgIG9wdGlvbnMuZWZmZWN0ID0gJ2N1YmUnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2NvdmVyZmxvdyc6XG4gICAgICAgICAgICBvcHRpb25zLmVmZmVjdCA9ICdjb3ZlcmZsb3cnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2NhcmRzJzpcbiAgICAgICAgICAgIG9wdGlvbnMuZWZmZWN0ID0gJ2NhcmRzJztcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdmbGlwJzpcbiAgICAgICAgICAgIG9wdGlvbnMuZWZmZWN0ID0gJ2ZsaXAnO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnM7XG59O1xuXG5leHBvcnQge1xuICAgIGlzRWZmZWN0T24sXG59O1xuIiwiLyoqXG4gKiBMYXp5IExvYWQgU2xpZGVyIE9wdGlvbnNcbiAqXG4gKiBUT0RPOiBtaXNzaW5nIG9wdGlvbiBmb3IgZGF0YSBvcHRpb24sIGNyZWF0ZSBwcmVsb2FkZXIgZGl2IHZpYSBqcywgYW5kIGNoYW5nZSBpbWFnZSBzcmMgdG8gZGF0YS1zcmMsIHJpZ2h0IG5vdyBhbGwgdGhpcyBkb25lIG1hbnVhbGx5XG4gKi9cblxuY29uc3QgaXNMYXp5TG9hZE9uID0gKGVsZW0sIG9wdGlvbnMpID0+IHtcbiAgICBpZighZWxlbSkgcmV0dXJuIG9wdGlvbnM7XG5cbiAgICAvL2xldCBpc0xhenlMb2FkID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2xpZGVyLWxhenknKTtcblxuICAgIG9wdGlvbnMucHJlbG9hZEltYWdlcyA9IGZhbHNlO1xuICAgIG9wdGlvbnMubGF6eSA9IHt9O1xuICAgIG9wdGlvbnMubGF6eS5sb2FkUHJldk5leHQgPSB0cnVlO1xuICAgIG9wdGlvbnMubG9hZE9uVHJhbnNpdGlvblN0YXJ0ID0gdHJ1ZTtcblxuICAgIHJldHVybiBvcHRpb25zO1xufVxuXG5leHBvcnQge1xuICAgIGlzTGF6eUxvYWRPblxufSIsIi8qKlxuICogTG9vcCBTbGlkZXIgT3B0aW9uc1xuICovXG5cbmNvbnN0IGlzTG9vcE9uID0gKGVsZW0sIG9wdGlvbnMpID0+IHtcbiAgICBpZighZWxlbSkgcmV0dXJuIG9wdGlvbnM7XG5cbiAgICBsZXQgaXNMb29wID0gZWxlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtc2xpZGVyLWxvb3AnKTtcblxuICAgIGlmKGlzTG9vcCA9PT0gJ3RydWUnKXtcbiAgICAgICAgb3B0aW9ucy5sb29wID0gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9ucztcbn1cblxuXG5leHBvcnQge1xuICAgIGlzTG9vcE9uXG59IiwiLyoqXG4gKiBOYXZpZ2F0aW9uIFNsaWRlciBPcHRpb25zXG4gKi9cblxuY29uc3QgaXNOYXZpZ2F0aW9uT24gPSAoZWxlbSwgb3B0aW9ucywgYmFzZW5hbWUsIGN1cnJlbnRJRCkgPT4ge1xuICAgIGxldCBuZXh0RWwgPSAnLnN3aXBlci1idXR0b24tbmV4dCc7XG4gICAgbGV0IHByZXZFbCA9ICcuc3dpcGVyLWJ1dHRvbi1wcmV2JztcbiAgICBsZXQgbmV4dElELCBwcmV2SUQsIHNsaWRlck5leHQsIHNsaWRlclByZXY7XG4gICAgaWYoIWVsZW0pIHJldHVybiBvcHRpb25zO1xuXG4gICAgbGV0IGlzTmF2aWdhdGlvbiA9IGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXNsaWRlci1uYXZpZ2F0aW9uJyk7XG5cbiAgICBpZihpc05hdmlnYXRpb24pIHtcbiAgICAgICAgb3B0aW9ucy5uYXZpZ2F0aW9uID0ge307XG5cbiAgICAgICAgaWYoYmFzZW5hbWUgJiYgKHR5cGVvZiBjdXJyZW50SUQgIT09IFwidW5kZWZpbmVkXCIpKSB7XG4gICAgICAgICAgICBuZXh0SUQgPSBgJHtiYXNlbmFtZX0tbmV4dC0ke2N1cnJlbnRJRH1gO1xuICAgICAgICAgICAgcHJldklEID0gYCR7YmFzZW5hbWV9LXByZXYtJHtjdXJyZW50SUR9YDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzbGlkZXJQYXJlbnQgPSBlbGVtLmNsb3Nlc3QoJy5tLXNsaWRlcicpO1xuICAgICAgICBpZihzbGlkZXJQYXJlbnQpIHtcbiAgICAgICAgICAgIHNsaWRlck5leHQgPSBzbGlkZXJQYXJlbnQucXVlcnlTZWxlY3RvcihuZXh0RWwpO1xuICAgICAgICAgICAgc2xpZGVyUHJldiA9IHNsaWRlclBhcmVudC5xdWVyeVNlbGVjdG9yKHByZXZFbCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYoc2xpZGVyTmV4dCAmJiBuZXh0SUQpIHtcbiAgICAgICAgICAgIHNsaWRlck5leHQuc2V0QXR0cmlidXRlKCdpZCcsIG5leHRJRCk7XG4gICAgICAgICAgICBvcHRpb25zLm5hdmlnYXRpb24ubmV4dEVsID0gYCMke25leHRJRH1gO1xuICAgICAgICB9XG4gICAgICAgIGlmKHNsaWRlclByZXYgJiYgcHJldklEKSB7XG4gICAgICAgICAgICBzbGlkZXJQcmV2LnNldEF0dHJpYnV0ZSgnaWQnLCBwcmV2SUQpO1xuICAgICAgICAgICAgb3B0aW9ucy5uYXZpZ2F0aW9uLnByZXZFbCA9IGAjJHtwcmV2SUR9YDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDEwMjQpIHtcbiAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCdkYXRhLXNsaWRlci1uYXZpZ2F0aW9uJywgJ291dGVyLWFycm93cycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtc2xpZGVyLW5hdmlnYXRpb24nLCBpc05hdmlnYXRpb24pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBvcHRpb25zLm5hdmlnYXRpb24gPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9ucztcbn1cblxuXG5cbmV4cG9ydCB7XG4gICAgaXNOYXZpZ2F0aW9uT25cbn1cbiIsIi8qKlxuICogUGFnaW5hdGlvbiBTbGlkZXIgT3B0aW9uc1xuICovXG5pbXBvcnQgeyB1X3BhcnNlQm9vbCB9IGZyb20gJy4uLy4uLy4uL3V0aWxzL3VfdHlwZXMnO1xuXG5jb25zdCBpc1BhZ2luYXRpb25PbiA9IChlbGVtLCBvcHRpb25zKSA9PiB7XG4gICAgaWYgKCFlbGVtKSByZXR1cm4gb3B0aW9ucztcblxuICAgIGNvbnN0IGlzUGFnaW5hdGlvbiA9IGVsZW0uZ2V0QXR0cmlidXRlKCdkYXRhLXNsaWRlci1wYWdpbmF0aW9uJyk7XG5cbiAgICBpZiAoaXNQYWdpbmF0aW9uKSB7XG4gICAgICAgIG9wdGlvbnMucGFnaW5hdGlvbiA9IHt9O1xuICAgICAgICBvcHRpb25zLnBhZ2luYXRpb24uZWwgPSAnLm0tc2xpZGVyX19wYWdpbmF0aW9uJztcblxuICAgICAgICBsZXQgbGVhZGluZ1plcm8gPSBmYWxzZTtcblxuICAgICAgICBpZiAoaXNQYWdpbmF0aW9uID09PSAnY29tYm8nIHx8IGlzUGFnaW5hdGlvbiA9PT0gJ2ZyYWN0aW9uJykge1xuICAgICAgICAgICAgbGVhZGluZ1plcm8gPSB1X3BhcnNlQm9vbChlbGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1zbGlkZXItbGVhZGluZy16ZXJvJykpIHx8IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgc3dpdGNoIChpc1BhZ2luYXRpb24pIHtcblxuICAgICAgICAgICAgY2FzZSAncHJvZ3Jlc3NiYXInOlxuICAgICAgICAgICAgICAgIG9wdGlvbnMucGFnaW5hdGlvbi50eXBlID0gJ3Byb2dyZXNzYmFyJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2ZyYWN0aW9uJzpcbiAgICAgICAgICAgICAgICBvcHRpb25zLnBhZ2luYXRpb24udHlwZSA9ICdmcmFjdGlvbic7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5wYWdpbmF0aW9uLmZvcm1hdEZyYWN0aW9uQ3VycmVudCA9IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlYWRpbmdaZXJvKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKG51bWJlciA8IDEwKSA/IGAwJHtudW1iZXJ9YCA6IG51bWJlcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVtYmVyO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5wYWdpbmF0aW9uLmZvcm1hdEZyYWN0aW9uVG90YWwgPSBmdW5jdGlvbiAobnVtYmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsZWFkaW5nWmVybykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChudW1iZXIgPCAxMCkgPyBgMCR7bnVtYmVyfWAgOiBudW1iZXI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bWJlcjtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnY29tYm8nOlxuICAgICAgICAgICAgICAgIG9wdGlvbnMucGFnaW5hdGlvbi50eXBlID0gJ2N1c3RvbSc7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5wYWdpbmF0aW9uLnJlbmRlckN1c3RvbSA9IGZ1bmN0aW9uIChzd2lwZXIsIGN1cnJlbnQsIHRvdGFsKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0b3RhbEZvcm1hdGVkID0gdG90YWw7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjdXJyZW50Rm9ybWF0ZWQgPSBjdXJyZW50O1xuICAgICAgICAgICAgICAgICAgICBsZXQgcHJvZ3Jlc3MgPSBwYXJzZUZsb2F0KGN1cnJlbnQgLyB0b3RhbCkudG9GaXhlZCg1KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobGVhZGluZ1plcm8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsRm9ybWF0ZWQgPSB0b3RhbCA8IDEwID8gYDAke3RvdGFsfWAgOiB0b3RhbDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRGb3JtYXRlZCA9IGN1cnJlbnQgPCAxMCA/IGAwJHtjdXJyZW50fWAgOiBjdXJyZW50O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwic3dpcGVyLXBhZ2luYXRpb24tcHJvZ3Jlc3NiYXIgc3dpcGVyLXBhZ2luYXRpb24taG9yaXpvbnRhbFwiIHN0eWxlPVwiLS1kYXRhLWN1cnJlbnQ6ICR7Y3VycmVudH0gOyAtLWRhdGEtdG90YWw6ICR7dG90YWx9OyAtLWRhdGEtcHJvZ3Jlc3M6ICR7cHJvZ3Jlc3N9XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwic3dpcGVyLXBhZ2luYXRpb24tcHJvZ3Jlc3NiYXItZmlsbFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInN3aXBlci1wYWdpbmF0aW9uLWZyYWN0aW9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInN3aXBlci1wYWdpbmF0aW9uLWN1cnJlbnRcIj4ke2N1cnJlbnRGb3JtYXRlZH08L3NwYW4+L1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJzd2lwZXItcGFnaW5hdGlvbi10b3RhbFwiPiR7dG90YWxGb3JtYXRlZH08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+YDtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBvcHRpb25zLnBhZ2luYXRpb24uY2xpY2thYmxlID0gdHJ1ZTtcblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGlzUGFnaW5hdGlvbiA9PT0gJ2NvbWJvJykge1xuICAgICAgICAgICAgY29uc3QgcGFnaW5hdGlvbiA9IGVsZW0ucXVlcnlTZWxlY3RvcignLm0tc2xpZGVyX19wYWdpbmF0aW9uJyk7XG4gICAgICAgICAgICBpZiAocGFnaW5hdGlvbikge1xuICAgICAgICAgICAgICAgIHBhZ2luYXRpb24uY2xhc3NMaXN0LmFkZCgnaGFzLWNvbWJvLXByb2dyZXNzJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPCAxMDI0KSB7XG4gICAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZSgnZGF0YS1zbGlkZXItcGFnaW5hdGlvbicsICdidWxsZXRzJyk7XG4gICAgICAgICAgICBvcHRpb25zLnBhZ2luYXRpb24uY2xpY2thYmxlID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCdkYXRhLXNsaWRlci1wYWdpbmF0aW9uJywgaXNQYWdpbmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgb3B0aW9ucy5wYWdpbmF0aW9uID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdGlvbnM7XG59O1xuXG5leHBvcnQge1xuICAgIGlzUGFnaW5hdGlvbk9uLFxufTtcbiIsImltcG9ydCB7IHVfZXh0ZW5kT2JqZWN0IH0gZnJvbSAnLi4vLi4vdXRpbHMvdV9vYmplY3RfZXh0ZW5kJztcbmltcG9ydCB7IHVfcGFyc2VCb29sIH0gZnJvbSAnLi4vLi4vdXRpbHMvdV90eXBlcyc7XG5pbXBvcnQgeyB1X3Rocm90dGxlZCB9IGZyb20gJy4uLy4uL3V0aWxzL3V0aWxzJztcblxuY2xhc3MgU3dpcGVyV2l0aENpcmN1bGFyVGFicyB7XG5cbiAgICBjb25zdHJ1Y3Rvcihzd2lwZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcubC1uYXYnLFxuICAgICAgICAgICAgaXRlbTogJy5jLW5hdl9faXRlbScsXG4gICAgICAgICAgICBjaXJjbGU6ICcuYy1zbGlkZXItbmF2JyxcbiAgICAgICAgICAgIHRyaWdnZXI6ICdjbGljaycsXG4gICAgICAgICAgICBjbGFzc2VzOiB7XG4gICAgICAgICAgICAgICAgYWN0aXZlOiAnaXMtYWN0aXZlJyxcbiAgICAgICAgICAgICAgICByaWdodDogJ2lzLXJpZ2h0JyxcbiAgICAgICAgICAgICAgICBsZWZ0OiAnaXMtbGVmdCcsXG4gICAgICAgICAgICAgICAgdG9wOiAnaXMtdG9wJyxcbiAgICAgICAgICAgICAgICBtaWRkbGU6ICdpcy1taWRkbGUnLFxuICAgICAgICAgICAgICAgIGJvdHRvbTogJ2lzLWJvdHRvbScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGlyZWN0aW9uOiBmYWxzZSwgLy8gZmFsc2U6IGNsb2Nrd2lzZSwgdHJ1ZTogYW50aWNsb2Nrd2lzZVxuICAgICAgICAgICAgcG9zaXRpb246IDIsIC8vIHBvc2l0aW9uIG9mIHN0YXJ0IGl0ZW0sIHRvcDogMSwgcmlnaHQ6IDIsIGJvdHRvbTogMywgbGVmdDogNFxuICAgICAgICAgICAgYXJyYW5nZTogMCwgLy8gYXJyYW5nZSAwID0gZnVsbCBjaXJjbGUsIGFueSBvdGhlciBudW1iZXIgbWVhbnMgYW5nbGVcbiAgICAgICAgICAgIGFycmFuZ2VDZW50ZXJlZDogdHJ1ZSwgLy8gZm9yY2UgY2VudGVyZWQgZXZlbiBpZiB1bmV2ZW4gbm8gb2YgaXRlbXNcbiAgICAgICAgICAgIGl0ZW1BbGlnbjogJ2NlbnRlcicsIC8vIGNlbnRlciwgaW5zaWRlLCBvdXRzaWRlXG4gICAgICAgICAgICBpdGVtQW5nbGU6IDAsXG4gICAgICAgICAgICByb3RhdGVBY3RpdmU6IGZhbHNlLFxuICAgICAgICAgICAgb2Zmc2V0OiAwLCAvLyBtYXggOTAsIG1pbiAtOTBcbiAgICAgICAgICAgIHN5bW1ldHJpYzogZmFsc2UsXG4gICAgICAgICAgICBzeW1tZXRyaWNPcmRlcjogJ2NvbHVtbnMnLCAvLyBjb2x1bW5zIG9yIHJvd3NcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBhcnJhbmdlOiAnZGF0YS1zbGlkZXItY2lyY3VsYXItYXJyYW5nZScsXG4gICAgICAgICAgICAgICAgYXJyYW5nZUNlbnRlcmVkOiAnZGF0YS1zbGlkZXItY2lyY3VsYXItY2VudGVyZWQnLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnZGF0YS1zbGlkZXItY2lyY3VsYXItcG9zaXRpb24nLFxuICAgICAgICAgICAgICAgIGl0ZW1BbmdsZTogJ2RhdGEtc2xpZGVyLWNpcmN1bGFyLWFuZ2xlJyxcbiAgICAgICAgICAgICAgICBpdGVtQWxpZ246ICdkYXRhLXNsaWRlci1jaXJjdWxhci1hbGlnbi1pdGVtcycsIC8vIHBhcnNlZCBmcm9tIGJhY2tlbmQgYWxzb1xuICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogJ2RhdGEtc2xpZGVyLWNpcmN1bGFyLWl0ZW0tZGlyZWN0aW9uJyxcbiAgICAgICAgICAgICAgICByb3RhdGVBY3RpdmU6ICdkYXRhLXNsaWRlci1jaXJjdWxhci1yb3RhdGUtdG8tYWN0aXZlJyxcbiAgICAgICAgICAgICAgICBvZmZzZXQ6ICdkYXRhLXNsaWRlci1jaXJjdWxhci1vZmZzZXQnLFxuICAgICAgICAgICAgICAgIHRyaWdnZXI6ICdkYXRhLXNsaWRlci1jaXJjdWxhci10cmlnZ2VyJyxcbiAgICAgICAgICAgICAgICBzeW1tZXRyaWM6ICdkYXRhLXNsaWRlci1jaXJjdWxhci1zeW1tZXRyaWMnLFxuICAgICAgICAgICAgICAgIHN5bW1ldHJpY09yZGVyOiAnZGF0YS1zbGlkZXItY2lyY3VsYXItb3JkZXInLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBpZiBzd2lwZXIgaXMgbm90IGluaXRpYWxpemVkLCBlbmQgdGhlIHNjcmlwdFxuICAgICAgICBpZiAoIXN3aXBlci5pbml0aWFsaXplZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3N3aXBlciBub3QgaW5pdGlhbGl6ZWQnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3dpcGVyID0gc3dpcGVyO1xuXG4gICAgICAgIHRoaXMuY29uZmlnID0gdV9leHRlbmRPYmplY3QodGhpcy5kZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICAgICAgdGhpcy5zZWxlY3RvciA9IGAke3RoaXMuY29uZmlnLmVsZW1lbnR9ICR7dGhpcy5jb25maWcuaXRlbX1gO1xuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5jb25maWcuZWxlbWVudCk7XG4gICAgICAgIHRoaXMuY2lyY2xlID0gdGhpcy5jb250YWluZXIucXVlcnlTZWxlY3Rvcih0aGlzLmNvbmZpZy5jaXJjbGUpO1xuICAgICAgICB0aGlzLml0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNlbGVjdG9yKTtcblxuICAgICAgICB0aGlzLnNoaWZ0ID0gMDtcbiAgICAgICAgdGhpcy5zaGlmdFN5bW1ldHJpYyA9IDE4MDtcbiAgICAgICAgdGhpcy5tdWx0aXBsaWVyID0gdGhpcy5pdGVtcy5sZW5ndGg7XG4gICAgICAgIHRoaXMubnVtYmVyT2ZJdGVtcyA9IHRoaXMuaXRlbXMubGVuZ3RoO1xuICAgICAgICB0aGlzLmFycmFuZ2VTaGlmdCA9IDA7XG4gICAgICAgIHRoaXMuZnVsbCA9IDM2MDtcbiAgICAgICAgdGhpcy5hcnJhbmdlSW5kZXggPSAwO1xuICAgICAgICAvLyByZWZlcmVuY2UgdG8gY2xpY2sgZnVuY3Rpb25cbiAgICAgICAgdGhpcy50YWJDbGlja2VkID0gdGhpcy50YWJDbGljay5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnBhcnNlT3B0aW9ucygpO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5nZXRDb250YWluZXJSYWRpdXMoKTtcbiAgICAgICAgc2VsZi5nZXRJdGVtRGltZW5zaW9ucygpO1xuICAgICAgICAvLyBhZGQgZXZlbnQgdGhhdCBjYXRjaGVzIHNsaWRlIGNoYW5nZXNcbiAgICAgICAgc2VsZi5zd2lwZXJTbGlkZUNoYW5nZSgpO1xuICAgICAgICAvLyBiaW5kIGV2ZW50cyB0aGF0IGNhdGNoZXMgdGFicyBjaGFuZ2VzXG4gICAgICAgIHNlbGYuYmluZFRhYnMoKTtcblxuICAgICAgICBzZWxmLnVwZGF0ZUl0ZW1zUG9zaXRpb25zKCk7XG5cbiAgICAgICAgc2VsZi5jb250YWluZXIuc3R5bGUuc2V0UHJvcGVydHkoJy0tbmF2aXRlbXMnLCBzZWxmLm51bWJlck9mSXRlbXMpO1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB1X3Rocm90dGxlZCgoKSA9PiB7XG4gICAgICAgICAgICBzZWxmLnVwZGF0ZUl0ZW1zUG9zaXRpb25zKCk7XG4gICAgICAgIH0pLCAxNTApO1xuICAgIH1cblxuICAgIGJpbmRUYWJzKCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgY29uc3QgZWxlbSA9IHNlbGYuaXRlbXM7XG5cbiAgICAgICAgZWxlbS5mb3JFYWNoKCh0YWIpID0+IHtcbiAgICAgICAgICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKHNlbGYuY29uZmlnLnRyaWdnZXIsIHNlbGYudGFiQ2xpY2tlZCwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuXG4gICAgICAgICAgICBpZiAoc2VsZi5pc1RvdWNoICYmIHNlbGYuY29uZmlnLnRyaWdnZXIgPT09ICdtb3VzZW92ZXInKSB7XG4gICAgICAgICAgICAgICAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBzZWxmLnRhYkNsaWNrZWQsIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdW5iaW5kVGFicygpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGVsZW0gPSBzZWxmLml0ZW1zO1xuXG4gICAgICAgIGVsZW0uZm9yRWFjaCgodGFiKSA9PiB7XG4gICAgICAgICAgICB0YWIucmVtb3ZlRXZlbnRMaXN0ZW5lcihzZWxmLmNvbmZpZy50cmlnZ2VyLCBzZWxmLnRhYkNsaWNrZWQpO1xuXG4gICAgICAgICAgICBpZiAoc2VsZi5pc1RvdWNoICYmIHNlbGYuY29uZmlnLnRyaWdnZXIgPT09ICdtb3VzZW92ZXInKSB7XG4gICAgICAgICAgICAgICAgdGFiLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBzZWxmLnRhYkNsaWNrZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0YWJDbGljayhldikge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgY29uc3QgY3VycmVudFRhYiA9IGV2LmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgIGNvbnN0IGVsZW0gPSBzZWxmLml0ZW1zO1xuICAgICAgICBcbiAgICAgICAgbGV0IGNsaWNrZWRUYWI7XG4gICAgICAgIGVsZW0uZm9yRWFjaCgodGFiLCBpKSA9PiB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFRhYiA9PT0gdGFiKSB7XG4gICAgICAgICAgICAgICAgY2xpY2tlZFRhYiA9IGk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0YWIuY2xhc3NMaXN0LnJlbW92ZShzZWxmLmNvbmZpZy5jbGFzc2VzLmFjdGl2ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGN1cnJlbnRUYWIuY2xhc3NMaXN0LmFkZChzZWxmLmNvbmZpZy5jbGFzc2VzLmFjdGl2ZSk7XG4gICAgICAgIHNlbGYuc3dpcGVyLnNsaWRlVG9Mb29wKGNsaWNrZWRUYWIpO1xuICAgICAgICBzZWxmLmNvbnRhaW5lci5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1jQUl0ZW0nLCBjbGlja2VkVGFiKTtcbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLnJvdGF0ZUFjdGl2ZSkge1xuICAgICAgICAgICAgc2VsZi51cGRhdGVJdGVtc1Bvc2l0aW9ucyhjbGlja2VkVGFiKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRhYkNoYW5nZShpbmRleCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgY29uc3QgZWxlbSA9IHNlbGYuaXRlbXM7XG4gICAgICAgIGVsZW0uZm9yRWFjaCgodGFiKSA9PiB7XG4gICAgICAgICAgICB0YWIuY2xhc3NMaXN0LnJlbW92ZShzZWxmLmNvbmZpZy5jbGFzc2VzLmFjdGl2ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGVsZW0uZm9yRWFjaCgodGFiLCBpKSA9PiB7XG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IGkpIHtcbiAgICAgICAgICAgICAgICB0YWIuY2xhc3NMaXN0LmFkZChzZWxmLmNvbmZpZy5jbGFzc2VzLmFjdGl2ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzZWxmLmNvbnRhaW5lci5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1jQUl0ZW0nLCBpbmRleCk7XG4gICAgfVxuXG4gICAgc3dpcGVyU2xpZGVDaGFuZ2UoKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIHNlbGYuc3dpcGVyLm9uKCdzbGlkZUNoYW5nZScsICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTbGlkZSA9IHNlbGYuc3dpcGVyLnJlYWxJbmRleDtcbiAgICAgICAgICAgIHNlbGYudGFiQ2hhbmdlKGN1cnJlbnRTbGlkZSk7XG4gICAgICAgICAgICBzZWxmLnVwZGF0ZUl0ZW1zUG9zaXRpb25zKGN1cnJlbnRTbGlkZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICB1cGRhdGVJdGVtc1Bvc2l0aW9ucyhpbmRleCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgY29uc3QgZWxlbXMgPSBzZWxmLml0ZW1zO1xuICAgICAgICBsZXQgaW5kO1xuXG4gICAgICAgIGlmIChpbmRleCA9PSBudWxsKSB7XG4gICAgICAgICAgICBpbmQgPSBzZWxmLmFycmFuZ2VJbmRleDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGluZCA9IGluZGV4O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBsZXQgYW5nbGU7XG4gICAgICAgIGxldCByb3RhdGVTaGlmdCA9IDA7XG5cbiAgICAgICAgaWYgKHNlbGYuY29uZmlnLnJvdGF0ZUFjdGl2ZSkge1xuICAgICAgICAgICAgcm90YXRlU2hpZnQgPSAoaW5kIC0gc2VsZi5hcnJhbmdlSW5kZXgpICogc2VsZi5jb25maWcuaXRlbUFuZ2xlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgeyBhcnJhbmdlU2hpZnQsIG11bHRpcGxpZXIsIGZ1bGwgfSA9IHNlbGY7XG5cbiAgICAgICAgY29uc3Qgb2JqQ2xhc3NlcyA9IE9iamVjdC52YWx1ZXMoc2VsZi5jb25maWcuY2xhc3Nlcyk7XG5cbiAgICAgICAgZWxlbXMuZm9yRWFjaCgoZWxlbSwgaSkgPT4ge1xuXG4gICAgICAgICAgICBsZXQgY3VycmVudEluZGV4ID0gaTtcbiAgICAgICAgICAgIGNvbnN0IGRpdmlkZXIgPSBNYXRoLmNlaWwoc2VsZi5udW1iZXJPZkl0ZW1zIC8gMik7XG4gICAgICAgICAgICBpZiAoc2VsZi5jb25maWcuc3ltbWV0cmljKSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuY29uZmlnLnN5bW1ldHJpY09yZGVyID09PSAncm93cycpIHtcbiAgICAgICAgICAgICAgICAgICAgaSAlIDIgPT09IDAgPyBjdXJyZW50SW5kZXggPSBpIC8gMiA6IGN1cnJlbnRJbmRleCA9IChpIC0gMSkgLyAyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmNvbmZpZy5zeW1tZXRyaWNPcmRlciA9PT0gJ2NvbHVtbnMnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpID4gZGl2aWRlciAtIDEpIGN1cnJlbnRJbmRleCA9IGkgLSBkaXZpZGVyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNlbGYuY29uZmlnLmRpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgIGFuZ2xlID0gZnVsbCAqIChjdXJyZW50SW5kZXggLyBtdWx0aXBsaWVyKVxuICAgICAgICAgICAgICAgICAgICArIHNlbGYuc2hpZnQgLSBhcnJhbmdlU2hpZnQgLSByb3RhdGVTaGlmdCAtIHNlbGYuY29uZmlnLm9mZnNldDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYW5nbGUgPSAtZnVsbCAqIChjdXJyZW50SW5kZXggLyBtdWx0aXBsaWVyKVxuICAgICAgICAgICAgICAgICAgICArIHNlbGYuc2hpZnQgKyBhcnJhbmdlU2hpZnQgKyByb3RhdGVTaGlmdCArIHNlbGYuY29uZmlnLm9mZnNldDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNlbGYuY29uZmlnLnN5bW1ldHJpYykge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLmNvbmZpZy5zeW1tZXRyaWNPcmRlciA9PT0gJ3Jvd3MnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpICUgMiA9PT0gMSkgYW5nbGUgPSBzZWxmLnNoaWZ0U3ltbWV0cmljIC0gYW5nbGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmNvbmZpZy5zeW1tZXRyaWNPcmRlciA9PT0gJ2NvbHVtbnMnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpID4gZGl2aWRlciAtIDEpIGFuZ2xlID0gc2VsZi5zaGlmdFN5bW1ldHJpYyAtIGFuZ2xlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgY29zaW5lID0gcGFyc2VGbG9hdChNYXRoLmNvcyhhbmdsZSAqIChNYXRoLlBJIC8gMTgwKSkudG9GaXhlZCg2KSk7XG4gICAgICAgICAgICBjb25zdCBzaW51cyA9IHBhcnNlRmxvYXQoTWF0aC5zaW4oYW5nbGUgKiAoTWF0aC5QSSAvIDE4MCkpLnRvRml4ZWQoNikpO1xuXG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmVzdGVkLXRlcm5hcnlcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1TaWRlWCA9IGNvc2luZSA9PT0gMFxuICAgICAgICAgICAgICAgID8gc2VsZi5jb25maWcuY2xhc3Nlcy5taWRkbGVcbiAgICAgICAgICAgICAgICA6ICgoY29zaW5lIDwgMClcbiAgICAgICAgICAgICAgICAgICAgPyBzZWxmLmNvbmZpZy5jbGFzc2VzLmxlZnRcbiAgICAgICAgICAgICAgICAgICAgOiBzZWxmLmNvbmZpZy5jbGFzc2VzLnJpZ2h0KTtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXN0ZWQtdGVybmFyeVxuICAgICAgICAgICAgY29uc3QgaXRlbVNpZGVZID0gc2ludXMgPT09IDBcbiAgICAgICAgICAgICAgICA/IHNlbGYuY29uZmlnLmNsYXNzZXMubWlkZGxlXG4gICAgICAgICAgICAgICAgOiAoc2ludXMgPCAwXG4gICAgICAgICAgICAgICAgICAgID8gc2VsZi5jb25maWcuY2xhc3Nlcy50b3BcbiAgICAgICAgICAgICAgICAgICAgOiBzZWxmLmNvbmZpZy5jbGFzc2VzLmJvdHRvbSk7XG5cbiAgICAgICAgICAgIG9iakNsYXNzZXMuZm9yRWFjaCgoY2xhc3NJdGVtcykgPT4ge1xuXG4gICAgICAgICAgICAgICAgaWYgKCEoY2xhc3NJdGVtcyA9PT0gJ2lzLWFjdGl2ZScgfHwgY2xhc3NJdGVtcyA9PT0gaXRlbVNpZGVZIHx8IGNsYXNzSXRlbXMgPT09IGl0ZW1TaWRlWCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzSXRlbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBzaW51cyA9PT0gMFxuICAgICAgICAgICAgICAgID8gZWxlbS5jbGFzc0xpc3QuYWRkKGl0ZW1TaWRlWSwgaXRlbVNpZGVYKVxuICAgICAgICAgICAgICAgIDogZWxlbS5jbGFzc0xpc3QuYWRkKGl0ZW1TaWRlWCwgaXRlbVNpZGVZKTtcblxuICAgICAgICAgICAgLyogY2FsY3VsYXRlIGFjdHVhbCBoZWlnaHQgb2Ygcm90YXRlZCBlbGVtZW50cyAqL1xuICAgICAgICAgICAgaWYgKHNlbGYuY29uZmlnLml0ZW1BbGlnbiAhPT0gJ2NlbnRlcicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBoZWlnaHQgPSBlbGVtLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgICAgICBjb25zdCB3aWR0aCA9IGVsZW0ub2Zmc2V0V2lkdGg7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBySGVpZ2h0ID0gcGFyc2VGbG9hdChcbiAgICAgICAgICAgICAgICAgICAgKE1hdGguYWJzKGNvc2luZSkgKiBoZWlnaHQpICsgKE1hdGguYWJzKHNpbnVzKSAqIHdpZHRoKSxcbiAgICAgICAgICAgICAgICApLnRvRml4ZWQoNik7XG4gICAgICAgICAgICAgICAgY29uc3QgcldpZHRoID0gcGFyc2VGbG9hdChcbiAgICAgICAgICAgICAgICAgICAgKE1hdGguYWJzKGNvc2luZSkgKiB3aWR0aCkgKyAoTWF0aC5hYnMoc2ludXMpICogaGVpZ2h0KSxcbiAgICAgICAgICAgICAgICApLnRvRml4ZWQoNik7XG5cbiAgICAgICAgICAgICAgICBlbGVtLnN0eWxlLnNldFByb3BlcnR5KCctLWl0ZW1SSCcsIGAke3JIZWlnaHR9cHhgKTtcbiAgICAgICAgICAgICAgICBlbGVtLnN0eWxlLnNldFByb3BlcnR5KCctLWl0ZW1SVycsIGAke3JXaWR0aH1weGApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBlbGVtLnN0eWxlLnNldFByb3BlcnR5KCctLWF6JywgYCR7YW5nbGV9ZGVnYCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHBhcnNlT3B0aW9ucygpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8qIHBhcnNlIGFycmFuZ2luZyBvZiBpdGVtcywgY2VudGVyLCBvciBub25lICovXG4gICAgICAgIGNvbnN0IGFycmFuZ2UgPSBzZWxmLmNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoc2VsZi5jb25maWcuZGF0YS5hcnJhbmdlKTtcbiAgICAgICAgLyogcGFyc2UgcG9zaXRpb24sIHRvcCwgbGVmdCwgcmlnaHQsIGJvdHRvbSAqL1xuICAgICAgICBzZWxmLmNvbmZpZy5wb3NpdGlvbiA9IHBhcnNlSW50KHNlbGYuY29udGFpbmVyLmdldEF0dHJpYnV0ZShzZWxmLmNvbmZpZy5kYXRhLnBvc2l0aW9uKSwgMTApO1xuXG4gICAgICAgIC8qIHBhcnNlIGFuZ2xlICovXG4gICAgICAgIHNlbGYuY29uZmlnLml0ZW1BbmdsZSA9IHBhcnNlSW50KFxuICAgICAgICAgICAgc2VsZi5jb250YWluZXIuZ2V0QXR0cmlidXRlKHNlbGYuY29uZmlnLmRhdGEuaXRlbUFuZ2xlKSxcbiAgICAgICAgICAgIDEwLFxuICAgICAgICApIHx8IHNlbGYuY29uZmlnLml0ZW1BbmdsZTtcbiAgICAgICAgLyogcGFyc2UgYWxpZ25tZW50IG9mIGl0ZW1zIHRvIGNpcmNsZSwgaW5zaWRlLCBvdXRzaWRlIG9yIGNlbnRlciAqL1xuICAgICAgICBzZWxmLmNvbmZpZy5pdGVtQWxpZ24gPSBzZWxmLmNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoc2VsZi5jb25maWcuZGF0YS5pdGVtQWxpZ24pXG4gICAgICAgICAgICB8fCBzZWxmLmNvbmZpZy5pdGVtQWxpZ247XG5cbiAgICAgICAgc2VsZi5jb25maWcuZGlyZWN0aW9uID0gdV9wYXJzZUJvb2woc2VsZi5jb250YWluZXIuZ2V0QXR0cmlidXRlKHNlbGYuY29uZmlnLmRhdGEuZGlyZWN0aW9uKSlcbiAgICAgICAgICAgIHx8IHNlbGYuY29uZmlnLmRpcmVjdGlvbjtcbiAgICAgICAgLyogcGFyc2UgZGlyZWN0aW9uLCBjbG9ja3dpc2UsIGFudGljbG9ja3dpc2UgKi9cbiAgICAgICAgc2VsZi5jb25maWcucm90YXRlQWN0aXZlID0gdV9wYXJzZUJvb2woXG4gICAgICAgICAgICBzZWxmLmNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoc2VsZi5jb25maWcuZGF0YS5yb3RhdGVBY3RpdmUpLFxuICAgICAgICApIHx8IHNlbGYuY29uZmlnLnJvdGF0ZUFjdGl2ZTtcbiAgICAgICAgLyogcGFyc2Ugb2Zmc2V0LCBpZiB5b3Ugd2FudCB0byBoYXZlIGl0ZW1zIHN0YXJ0XG4gICAgICAgIGZyb20gZGlmZmVyZW50IGFuZ2xlIGZyb20gc3RhcnRpbmcgcG9zaXRpb24gKi9cbiAgICAgICAgc2VsZi5jb25maWcub2Zmc2V0ID0gcGFyc2VJbnQoc2VsZi5jb250YWluZXIuZ2V0QXR0cmlidXRlKHNlbGYuY29uZmlnLmRhdGEub2Zmc2V0KSwgMTApXG4gICAgICAgICAgICB8fCBzZWxmLmNvbmZpZy5vZmZzZXQ7XG4gICAgICAgIC8qIHRyaWdnZXIgbWV0aG9kLCBjbGljayBvciBtb3VzZW92ZXIgKi9cbiAgICAgICAgY29uc3QgdHJpZ2dlciA9IHNlbGYuY29udGFpbmVyLmdldEF0dHJpYnV0ZShzZWxmLmNvbmZpZy5kYXRhLnRyaWdnZXIpXG4gICAgICAgICAgICB8fCBzZWxmLmNvbmZpZy50cmlnZ2VyO1xuXG4gICAgICAgIGlmICh0cmlnZ2VyID09PSAnbW91c2VvdmVyJykge1xuICAgICAgICAgICAgc2VsZi5jb25maWcudHJpZ2dlciA9ICdtb3VzZW92ZXInO1xuICAgICAgICAgICAgc2VsZi5jb25maWcucm90YXRlQWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBzd2l0Y2ggKHNlbGYuY29uZmlnLnBvc2l0aW9uKSB7XG5cbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBzZWxmLnNoaWZ0ID0gLTkwO1xuICAgICAgICAgICAgICAgIHNlbGYuc2hpZnRTeW1tZXRyaWMgPSAwO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgIHNlbGYuc2hpZnQgPSA5MDtcbiAgICAgICAgICAgICAgICBzZWxmLnNoaWZ0U3ltbWV0cmljID0gMDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICBzZWxmLnNoaWZ0ID0gMTgwO1xuICAgICAgICAgICAgICAgIHNlbGYuc2hpZnRTeW1tZXRyaWMgPSAxODA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHNlbGYuc2hpZnQgPSAwO1xuICAgICAgICAgICAgICAgIHNlbGYuc2hpZnRTeW1tZXRyaWMgPSAxODA7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpc1NlbWlDaXJjbGUgPSBmYWxzZTtcblxuICAgICAgICBpZiAoc2VsZi5jb25maWcuaXRlbUFuZ2xlXG4gICAgICAgICAgICAmJiAoc2VsZi5jb25maWcuaXRlbUFuZ2xlICogc2VsZi5udW1iZXJPZkl0ZW1zIDw9IHNlbGYuZnVsbClcbiAgICAgICAgICAgICYmIChzZWxmLmNvbmZpZy5pdGVtQW5nbGUgPiAxNSkpIHtcbiAgICAgICAgICAgIHNlbGYuZnVsbCA9IHNlbGYuY29uZmlnLml0ZW1BbmdsZTtcbiAgICAgICAgICAgIHNlbGYubXVsdGlwbGllciA9IDE7XG4gICAgICAgICAgICBpc1NlbWlDaXJjbGUgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5jb25maWcuaXRlbUFuZ2xlID0gKHNlbGYuZnVsbCAvIHNlbGYubnVtYmVyT2ZJdGVtcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXJyYW5nZSA9PT0gJ2NlbnRlcicgJiYgaXNTZW1pQ2lyY2xlKSB7XG4gICAgICAgICAgICAvKiBwYXJzZSBmb3JjZSBjZW50ZXJlZCAqL1xuICAgICAgICAgICAgc2VsZi5jb25maWcuYXJyYW5nZUNlbnRlcmVkID0gdV9wYXJzZUJvb2woXG4gICAgICAgICAgICAgICAgc2VsZi5jb250YWluZXIuZ2V0QXR0cmlidXRlKHNlbGYuY29uZmlnLmRhdGEuYXJyYW5nZUNlbnRlcmVkKSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICAvKiBwYXJzZSBzeW1tZXRyaWMgb3B0aW9ucyAqL1xuICAgICAgICAgICAgc2VsZi5jb25maWcuc3ltbWV0cmljID0gdV9wYXJzZUJvb2woXG4gICAgICAgICAgICAgICAgc2VsZi5jb250YWluZXIuZ2V0QXR0cmlidXRlKHNlbGYuY29uZmlnLmRhdGEuc3ltbWV0cmljKSxcbiAgICAgICAgICAgICkgfHwgc2VsZi5jb25maWcuc3ltbWV0cmljO1xuICAgICAgICAgICAgc2VsZi5jb25maWcuc3ltbWV0cmljT3JkZXIgPSBzZWxmLmNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoXG4gICAgICAgICAgICAgICAgc2VsZi5jb25maWcuZGF0YS5zeW1tZXRyaWNPcmRlcixcbiAgICAgICAgICAgICkgfHwgc2VsZi5jb25maWcuc3ltbWV0cmljT3JkZXI7XG5cbiAgICAgICAgICAgIGlmIChzZWxmLmNvbmZpZy5zeW1tZXRyaWMpIHNlbGYuY29uZmlnLnJvdGF0ZUFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICBjb25zdCBkaXZpZGVyID0gc2VsZi5jb25maWcuc3ltbWV0cmljID8gNCA6IDI7XG4gICAgICAgICAgICBzZWxmLmFycmFuZ2VJbmRleCA9ICgoc2VsZi5udW1iZXJPZkl0ZW1zIC0gMSkgLyBkaXZpZGVyKTtcbiAgICAgICAgICAgIGlmIChzZWxmLmNvbmZpZy5hcnJhbmdlQ2VudGVyZWQpIHNlbGYuYXJyYW5nZUluZGV4ID0gTWF0aC5mbG9vcihzZWxmLmFycmFuZ2VJbmRleCk7XG4gICAgICAgICAgICBzZWxmLmFycmFuZ2VTaGlmdCA9IHNlbGYuYXJyYW5nZUluZGV4ICogc2VsZi5jb25maWcuaXRlbUFuZ2xlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKE1hdGguYWJzKHNlbGYuY29uZmlnLm9mZnNldCkgPiA5MCkge1xuICAgICAgICAgICAgc2VsZi5jb25maWcub2Zmc2V0ID0gMDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBnZXRDb250YWluZXJSYWRpdXMoKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBjb25zdCB7IGNpcmNsZSB9ID0gc2VsZjtcblxuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcigoZW50cmllcykgPT4ge1xuXG4gICAgICAgICAgICBlbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHVyZXJhZGl1cyA9IGVudHJ5LmNvbnRlbnRSZWN0LndpZHRoIC8gMjtcbiAgICAgICAgICAgICAgICBjb25zdCByYWRpdXMgPSBlbnRyeS5ib3JkZXJCb3hTaXplWzBdLmlubGluZVNpemUgLyAyO1xuXG4gICAgICAgICAgICAgICAgZW50cnkudGFyZ2V0LnN0eWxlLnNldFByb3BlcnR5KCctLXInLCBgJHtwdXJlcmFkaXVzLnRvRml4ZWQoKX1weGApO1xuICAgICAgICAgICAgICAgIGVudHJ5LnRhcmdldC5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1yY2xlYW4nLCBgJHtyYWRpdXMudG9GaXhlZCgpfXB4YCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUoY2lyY2xlKTtcbiAgICB9XG5cbiAgICBnZXRJdGVtRGltZW5zaW9ucygpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGVsZW1zID0gc2VsZi5pdGVtcztcblxuICAgICAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcigoZW50cmllcykgPT4ge1xuXG4gICAgICAgICAgICBlbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyB3aWR0aCwgaGVpZ2h0IH0gPSBlbnRyeS5jb250ZW50UmVjdDtcblxuICAgICAgICAgICAgICAgIGVudHJ5LnRhcmdldC5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1pdGVtSCcsIGAke2hlaWdodH1weGApO1xuICAgICAgICAgICAgICAgIGVudHJ5LnRhcmdldC5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1pdGVtVycsIGAke3dpZHRofXB4YCk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBlbGVtcy5mb3JFYWNoKChlbGVtKSA9PiB7XG4gICAgICAgICAgICBvYnNlcnZlci5vYnNlcnZlKGVsZW0pO1xuICAgICAgICB9KTtcblxuICAgIH1cbiAgICBcbn1cblxuZXhwb3J0IGRlZmF1bHQgU3dpcGVyV2l0aENpcmN1bGFyVGFicztcbiIsImltcG9ydCB7IHVfaXNUb3VjaERldmljZSB9IGZyb20gXCIuLi8uLi91dGlscy91X2lzLXRvdWNoLWRldmljZVwiO1xuXG5jbGFzcyBTd2lwZXJXaXRoVGFicyB7XG5cbiAgICBjb25zdHJ1Y3Rvcihzd2lwZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5kZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIGVsZW1lbnQ6ICcubC1uYXYnLFxuICAgICAgICAgICAgaXRlbTogJy5jLW5hdl9faXRlbScsXG4gICAgICAgICAgICBhY3RpdmU6ICdpcy1hY3RpdmUnLFxuICAgICAgICAgICAgdHJpZ2dlcjogJ2NsaWNrJ1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNUb3VjaCA9IGZhbHNlO1xuICAgICAgICAvLyB1dGlsIGZ1bmN0aW9uIHRvIGNoZWNrIGZvciB0b3VjaCBkZXZpY2VcbiAgICAgICAgdGhpcy5pc1RvdWNoRGV2aWNlKCk7XG5cbiAgICAgICAgLy8gaWYgc3dpcGVyIGlzIG5vdCBpbml0aWFsaXplZCwgZW5kIHRoZSBzY3JpcHRcbiAgICAgICAgaWYoIXN3aXBlci5pbml0aWFsaXplZClcbiAgICAgICAge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3N3aXBlciBub3QgaW5pdGlhbGl6ZWQnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3dpcGVyID0gc3dpcGVyO1xuXG4gICAgICAgIHRoaXMuY29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5kZWZhdWx0cywgb3B0aW9ucyB8fCB7fSk7XG5cbiAgICAgICAgdGhpcy5zZWxlY3RvciA9IGAke3RoaXMuY29uZmlnLmVsZW1lbnR9ICR7dGhpcy5jb25maWcuaXRlbX1gO1xuICAgICAgICB0aGlzLml0ZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNlbGVjdG9yKTtcblxuICAgICAgICAvLyByZWZlcmVuY2UgdG8gY2xpY2sgZnVuY3Rpb25cbiAgICAgICAgdGhpcy50YWJDbGlja2VkID0gdGhpcy50YWJDbGljay5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyBhZGQgZXZlbnQgdGhhdCBjYXRjaGVzIHNsaWRlIGNoYW5nZXNcbiAgICAgICAgc2VsZi5zd2lwZXJTbGlkZUNoYW5nZSgpO1xuICAgICAgICAvLyBiaW5kIGV2ZW50cyB0aGF0IGNhdGNoZXMgdGFicyBjaGFuZ2VzXG4gICAgICAgIHNlbGYuYmluZFRhYnMoKTtcbiAgICB9XG5cbiAgICBiaW5kVGFicygpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGVsZW0gPSBzZWxmLml0ZW1zO1xuXG4gICAgICAgIGVsZW0uZm9yRWFjaCgodGFiKSA9PiB7XG4gICAgICAgICAgICB0YWIuYWRkRXZlbnRMaXN0ZW5lcihzZWxmLmNvbmZpZy50cmlnZ2VyLCBzZWxmLnRhYkNsaWNrZWQsIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcblxuICAgICAgICAgICAgaWYoc2VsZi5pc1RvdWNoICYmIHNlbGYuY29uZmlnLnRyaWdnZXIgPT09ICdtb3VzZW92ZXInKSB7XG4gICAgICAgICAgICAgICAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBzZWxmLnRhYkNsaWNrZWQsIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICB1bmJpbmRUYWJzKCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgY29uc3QgZWxlbSA9IHNlbGYuaXRlbXM7XG5cbiAgICAgICAgZWxlbS5mb3JFYWNoKCh0YWIpID0+IHtcbiAgICAgICAgICAgIHRhYi5yZW1vdmVFdmVudExpc3RlbmVyKHNlbGYuY29uZmlnLnRyaWdnZXIsIHNlbGYudGFiQ2xpY2tlZCk7XG5cbiAgICAgICAgICAgIGlmKHNlbGYuaXNUb3VjaCAmJiBzZWxmLmNvbmZpZy50cmlnZ2VyID09PSAnbW91c2VvdmVyJykge1xuICAgICAgICAgICAgICAgIHRhYi5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgc2VsZi50YWJDbGlja2VkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICB0YWJDbGljayhldikge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgY29uc3QgY3VycmVudFRhYiA9IGV2LmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgIGNvbnN0IGVsZW0gPSBzZWxmLml0ZW1zO1xuXG4gICAgICAgIGxldCBjbGlja2VkVGFiO1xuICAgICAgICBlbGVtLmZvckVhY2goKHRhYiwgaSkgPT4ge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRUYWIgPT09IHRhYikge1xuICAgICAgICAgICAgICAgIGNsaWNrZWRUYWIgPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGFiLmNsYXNzTGlzdC5yZW1vdmUoc2VsZi5jb25maWcuYWN0aXZlKTtcbiAgICAgICAgfSlcblxuICAgICAgICBjdXJyZW50VGFiLmNsYXNzTGlzdC5hZGQoc2VsZi5jb25maWcuYWN0aXZlKTtcbiAgICAgICAgc2VsZi5zd2lwZXIuc2xpZGVUb0xvb3AoY2xpY2tlZFRhYik7XG4gICAgfVxuXG4gICAgdGFiQ2hhbmdlKGluZGV4KSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBjb25zdCBlbGVtID0gc2VsZi5pdGVtcztcbiAgICAgICAgZWxlbS5mb3JFYWNoKCh0YWIpID0+IHtcbiAgICAgICAgICAgIHRhYi5jbGFzc0xpc3QucmVtb3ZlKHNlbGYuY29uZmlnLmFjdGl2ZSk7XG4gICAgICAgIH0pXG5cbiAgICAgICAgZWxlbS5mb3JFYWNoKCh0YWIsIGkpID0+IHtcbiAgICAgICAgICAgIGlmIChpbmRleCA9PT0gaSkge1xuICAgICAgICAgICAgICAgIHRhYi5jbGFzc0xpc3QuYWRkKHNlbGYuY29uZmlnLmFjdGl2ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICB9XG5cbiAgICBpc1RvdWNoRGV2aWNlKCkge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGlmKHVfaXNUb3VjaERldmljZSgpKVxuICAgICAgICB7XG4gICAgICAgICAgICBzZWxmLmlzVG91Y2ggPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3dpcGVyU2xpZGVDaGFuZ2UoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICBzZWxmLnN3aXBlci5vbignc2xpZGVDaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50U2xpZGUgPSBzZWxmLnN3aXBlci5yZWFsSW5kZXg7XG4gICAgICAgICAgICBzZWxmLnRhYkNoYW5nZShjdXJyZW50U2xpZGUpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFN3aXBlcldpdGhUYWJzO1xuIiwiaW1wb3J0IHsgdV9leHRlbmRPYmplY3QgfSBmcm9tICcuLi8uLi91dGlscy91X29iamVjdF9leHRlbmQnO1xuaW1wb3J0IHsgdV9zbGlkZURvd24sIHVfc2xpZGVVcCB9IGZyb20gJy4uLy4uL3V0aWxzL3Vfc2xpZGUtdXAtZG93bic7XG5pbXBvcnQgeyB1X2ZhZGVJbiwgdV9mYWRlT3V0IH0gZnJvbSAnLi4vLi4vdXRpbHMvdV9mYWRlLWluLW91dCc7XG5pbXBvcnQgeyB1X3BhcnNlQm9vbCB9IGZyb20gJy4uLy4uL3V0aWxzL3VfdHlwZXMnO1xuaW1wb3J0IHsgc2Nyb2xsVG9VdGlsIH0gZnJvbSAnLi4vYW5pbWF0aW9ucy9zY3JvbGwtdG8nO1xuaW1wb3J0IHsgZWFzZUluUXVhZCB9IGZyb20gJy4uL2FuaW1hdGlvbnMvZWFzaW5ncy1lczYnO1xuXG5jbGFzcyBEU01QQWNjb3JkaW9ucyB7XG4gICAgY29uc3RydWN0b3Ioc2VsZWN0b3IsIG9wdGlvbnMpIHtcbiAgICAgICAgLy8gZGVmYXVsdCB3cmFwcGVyIHZhbHVlXG4gICAgICAgIHRoaXMud3JhcHBlciA9ICcuanMtYWNjLXdyYXBwZXInO1xuXG4gICAgICAgIHRoaXMuZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBzZWxlY3RvcnM6IHtcbiAgICAgICAgICAgICAgICBpdGVtOiAnLmpzLWFjYy1pdGVtJyxcbiAgICAgICAgICAgICAgICB0cmlnZ2VyOiAnLmpzLWFjYy1idXR0b24nLFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICcuanMtYWNjLWNvbnRlbnQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdhbGxlcnk6IHtcbiAgICAgICAgICAgICAgICBjb250YWluZXI6ICcuanMtYWNjLWdhbGxlcnknLFxuICAgICAgICAgICAgICAgIGl0ZW06ICcuanMtYWNjLW1lZGlhJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbGFzc2VzOiB7XG4gICAgICAgICAgICAgICAgYWN0aXZlOiAnaXMtYWN0aXZlJyxcbiAgICAgICAgICAgICAgICBmb2N1czogJ2ZvY3VzJyxcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGlvbjoge1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IHRydWUsIC8vIHRydWU6IHVzZSBqcyAsIGZhbHNlOiB1c2UgY3NzXG4gICAgICAgICAgICAgICAgZ2FsbGVyeTogZmFsc2UsIC8vIHRydWU6IHVzZSBqcyAsIGZhbHNlOiB1c2UgY3NzXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYXR0cjoge1xuICAgICAgICAgICAgICAgIGNsb3NlOiAnZGF0YS1jbG9zZScsXG4gICAgICAgICAgICAgICAgb3BlbjogJ2RhdGEtZXhwYW5kJyxcbiAgICAgICAgICAgICAgICBnYWxsZXJ5OiAnZGF0YS1nYWxsZXJ5JyxcbiAgICAgICAgICAgICAgICBzdGFydENsb3NlZDogJ2RhdGEtc3RhcnQtY2xvc2VkJyxcbiAgICAgICAgICAgICAgICBhbmltYXRpb25Db250ZW50OiAnZGF0YS1hbmltYXRpb24nLFxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbkdhbGxlcnk6ICdkYXRhLWdhbGxlcnktYW5pbWF0aW9uJyxcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZGF0YS1hY2MtZGlzcGxheScsXG4gICAgICAgICAgICAgICAgc2Nyb2xsVG9WaWV3OiAnZGF0YS1zY3JvbGwtdG8tdmlldycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3B0OiB7XG4gICAgICAgICAgICAgICAgY2xvc2U6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGV4cGFuZDogZmFsc2UsXG4gICAgICAgICAgICAgICAgaGFzR2FsbGVyeTogZmFsc2UsXG4gICAgICAgICAgICAgICAgc3RhcnRDbG9zZWQ6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHNjcm9sbFRvVmlldzogZmFsc2UsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYXJpYToge1xuICAgICAgICAgICAgICAgIGJ1dHRvbjogJ2hlYWRlcicsXG4gICAgICAgICAgICAgICAgY29udGVudDogJ2NvbnRlbnQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBicmVha3BvaW50czoge1xuICAgICAgICAvLyAgICAgdGFibGV0OiAxMTEzLFxuICAgICAgICAvLyAgICAgICAgIG1vYmlsZTogNzY5LFxuICAgICAgICAvLyB9LFxuXG4gICAgICAgIHRoaXMuY29uZmlnID0gdV9leHRlbmRPYmplY3QodGhpcy5kZWZhdWx0cywgb3B0aW9ucyApO1xuICAgICAgICAvLyBjaGVjayBpZiB3ZSBjaGFuZ2VkIHNlbGVjdG9yXG4gICAgICAgIGlmKHR5cGVvZiBzZWxlY3RvciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgdGhpcy53cmFwcGVyID0gc2VsZWN0b3I7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBnZXQgbmFtZSB0byB1c2UgZm9yIGFyaWEgaWQncyBhbmQgY29udHJvbHNcbiAgICAgICAgdGhpcy5nZXRBcmlhTmFtZSgpO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0b3IgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMud3JhcHBlcik7XG5cbiAgICAgICAgdGhpcy5ldmVudHNMaXN0ZW5lcnMgPSB7fTtcblxuICAgICAgICB0aGlzLnBhcnNlT3B0aW9ucygpO1xuICAgICAgICB0aGlzLnNob3VsZFNjcm9sbCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMubXFsID0gd2luZG93Lm1hdGNoTWVkaWEoJyhtYXgtd2lkdGg6IDExMTNweCknKTtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLm9wdC5zY3JvbGxUb1ZpZXcpIHtcbiAgICAgICAgICAgIHRoaXMuc2hvdWxkU2Nyb2xsID0gdGhpcy5tcWwubWF0Y2hlcztcblxuICAgICAgICAgICAgdGhpcy5tcWwuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3VsZFNjcm9sbCA9IGUubWF0Y2hlcztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50cmlnZ2VyID0gdGhpcy5zZWxlY3Rvci5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuY29uZmlnLnNlbGVjdG9ycy50cmlnZ2VyKTtcbiAgICAgICAgdGhpcy5pdGVtcyA9IHRoaXMuc2VsZWN0b3IucXVlcnlTZWxlY3RvckFsbCh0aGlzLmNvbmZpZy5zZWxlY3RvcnMuaXRlbSk7XG5cbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLm9wdC5oYXNHYWxsZXJ5KSB7XG4gICAgICAgICAgICB0aGlzLmdhbGxlcnlJdGVtcyA9IHRoaXMuc2VsZWN0b3IucXVlcnlTZWxlY3RvckFsbCh0aGlzLmNvbmZpZy5nYWxsZXJ5Lml0ZW0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYXJyYXkgZm9yIHN0YXNoaW5nIHJlZmVyZW5jZSB0byBiaW5kZWQgZXZlbnRzXG4gICAgICAgIHRoaXMuaGFuZGxlcnMgPSBbXTtcblxuICAgICAgICB0aGlzLnByZXZpb3VzSW5kZXggPSAwO1xuICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IDA7XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5hZGRBcmlhKCk7XG4gICAgICAgIHRoaXMucHJlcGFyZUZvckFuaW1hdGlvbigpO1xuICAgICAgICB0aGlzLmFjY29yZGlvbkJpbmRFdmVudHMoKTtcbiAgICB9XG5cbiAgICByZUluaXQoKSB7XG4gICAgICAgIHRoaXMuYWNjb3JkaW9uVW5iaW5kRXZlbnRzKCk7XG4gICAgICAgIHRoaXMudHJpZ2dlciA9IHRoaXMuc2VsZWN0b3IucXVlcnlTZWxlY3RvckFsbCh0aGlzLmNvbmZpZy5zZWxlY3RvcnMudHJpZ2dlcik7XG4gICAgICAgIHRoaXMuaXRlbXMgPSB0aGlzLnNlbGVjdG9yLnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5jb25maWcuc2VsZWN0b3JzLml0ZW0pO1xuICAgICAgICB0aGlzLmhhbmRsZXJzID0gW107XG4gICAgICAgIHRoaXMuYWRkQXJpYSgpO1xuICAgICAgICB0aGlzLnJlSW5pdEFuaW1hdGlvbigpO1xuICAgICAgICB0aGlzLmFjY29yZGlvbkJpbmRFdmVudHMoKTtcbiAgICB9XG5cbiAgICBvbihldmVudHMsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSByZXR1cm47XG5cbiAgICAgICAgZXZlbnRzLnNwbGl0KCcgJykuZm9yRWFjaCgoZXZlbnQsIGkpID0+IHtcbiAgICAgICAgICAgIGlmICghc2VsZi5ldmVudHNMaXN0ZW5lcnNbZXZlbnRdKSBzZWxmLmV2ZW50c0xpc3RlbmVyc1tldmVudF0gPSBbXTtcbiAgICAgICAgICAgIHNlbGYuZXZlbnRzTGlzdGVuZXJzW2V2ZW50XS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb2ZmKGV2ZW50cywgaGFuZGxlcikge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKCFzZWxmLmV2ZW50c0xpc3RlbmVycykgcmV0dXJuO1xuICAgICAgICBldmVudHMuc3BsaXQoJyAnKS5mb3JFYWNoKChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHNlbGYuZXZlbnRzTGlzdGVuZXJzW2V2ZW50XSA9IFtdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLmV2ZW50c0xpc3RlbmVyc1tldmVudF0pIHtcbiAgICAgICAgICAgICAgICBzZWxmLmV2ZW50c0xpc3RlbmVyc1tldmVudF0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnRIYW5kbGVyID09PSBoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmV2ZW50c0xpc3RlbmVyc1tldmVudF0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBlbWl0KC4uLmFyZ3MpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCFzZWxmLmV2ZW50c0xpc3RlbmVycykgcmV0dXJuIHNlbGY7XG4gICAgICAgIGxldCBldmVudHM7XG4gICAgICAgIGxldCBkYXRhO1xuICAgICAgICBsZXQgY29udGV4dDtcblxuICAgICAgICBpZiAodHlwZW9mIGFyZ3NbMF0gPT09ICdzdHJpbmcnIHx8IEFycmF5LmlzQXJyYXkoYXJnc1swXSkpIHtcbiAgICAgICAgICAgIGV2ZW50cyA9IGFyZ3NbMF07XG4gICAgICAgICAgICBkYXRhID0gYXJncy5zbGljZSgxLCBhcmdzLmxlbmd0aCk7XG4gICAgICAgICAgICBjb250ZXh0ID0gc2VsZjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV2ZW50cyA9IGFyZ3NbMF0uZXZlbnRzO1xuICAgICAgICAgICAgZGF0YSA9IGFyZ3NbMF0uZGF0YTtcbiAgICAgICAgICAgIGNvbnRleHQgPSBhcmdzWzBdLmNvbnRleHQgfHwgc2VsZjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vY29uc29sZS5sb2coZXZlbnRzLCBkYXRhLCBjb250ZXh0KTtcbiAgICAgICAgZGF0YS51bnNoaWZ0KGNvbnRleHQpO1xuICAgICAgICBjb25zdCBldmVudHNBcnJheSA9IEFycmF5LmlzQXJyYXkoZXZlbnRzKSA/IGV2ZW50cyA6IGV2ZW50cy5zcGxpdCgnICcpO1xuXG4gICAgICAgIGV2ZW50c0FycmF5LmZvckVhY2goKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAoc2VsZi5ldmVudHNMaXN0ZW5lcnMgJiYgc2VsZi5ldmVudHNMaXN0ZW5lcnNbZXZlbnRdKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5ldmVudHNMaXN0ZW5lcnNbZXZlbnRdLmZvckVhY2goKGV2ZW50SGFuZGxlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICBldmVudEhhbmRsZXIuYXBwbHkoY29udGV4dCwgZGF0YSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFjY29yZGlvbkJpbmRFdmVudHMoKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IGVsZW0gPSBzZWxmLnRyaWdnZXI7XG5cbiAgICAgICAgc2VsZi5hZGRMaXN0ZW5lckZvY3VzID0gc2VsZi5hZGRMaXN0ZW5lckZvY3VzLmJpbmQoc2VsZik7XG4gICAgICAgIHNlbGYuYWRkTGlzdGVuZXJCbHVyID0gc2VsZi5hZGRMaXN0ZW5lckJsdXIuYmluZChzZWxmKTtcbiAgICAgICAgc2VsZi5hZGRLZXlMaXN0ZW5lciA9IHNlbGYuYWRkS2V5TGlzdGVuZXIuYmluZChzZWxmKTtcblxuICAgICAgICBzZWxmLm9uID0gc2VsZi5vbi5iaW5kKHNlbGYpO1xuICAgICAgICBzZWxmLm9mZiA9IHNlbGYub2ZmLmJpbmQoc2VsZik7XG4gICAgICAgIHNlbGYuZW1pdCA9IHNlbGYuZW1pdC5iaW5kKHNlbGYpO1xuXG4gICAgICAgIGVsZW0uZm9yRWFjaCgoYWNjLCBpKSA9PiB7XG4gICAgICAgICAgICBsZXQgaGFuZGxlckZ1bmMgPSBzZWxmLmFjY29yZGlvbk5hdkNsaWNrLmJpbmQoc2VsZiwgaSk7XG4gICAgICAgICAgICBzZWxmLmhhbmRsZXJzLnB1c2goaGFuZGxlckZ1bmMpO1xuICAgICAgICAgICAgYWNjLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlckZ1bmMsIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIGFjYy5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHNlbGYuYWRkTGlzdGVuZXJGb2N1cywgeyBwYXNzaXZlOiB0cnVlIH0pO1xuICAgICAgICAgICAgYWNjLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBzZWxmLmFkZExpc3RlbmVyQmx1ciwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuICAgICAgICB9KVxuXG4gICAgICAgIGxldCBhY2NvcmRpb24gPSBzZWxmLnNlbGVjdG9yO1xuICAgICAgICBhY2NvcmRpb24uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHNlbGYuYWRkS2V5TGlzdGVuZXIsIHsgcGFzc2l2ZTogdHJ1ZSB9KTtcbiAgICB9XG5cbiAgICBhY2NvcmRpb25VbmJpbmRFdmVudHMoKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBjb25zdCBlbGVtID0gc2VsZi50cmlnZ2VyO1xuXG4gICAgICAgIGVsZW0uZm9yRWFjaCgoYWNjLCBpKSA9PiB7XG4gICAgICAgICAgICBsZXQgZWxlbVBhcmVudCA9IGFjYy5jbG9zZXN0KHNlbGYuY29uZmlnLnNlbGVjdG9ycy5pdGVtKTtcbiAgICAgICAgICAgIGxldCBlbGVtQ29udGVudCA9IGVsZW1QYXJlbnQucXVlcnlTZWxlY3RvcihzZWxmLmNvbmZpZy5zZWxlY3RvcnMuY29udGVudCk7XG5cbiAgICAgICAgICAgIGxldCBjb250cm9sLCBoZWFkZXI7XG4gICAgICAgICAgICBpZihzZWxmLmNvbmZpZy5hcmlhLm5hbWUpIHtcbiAgICAgICAgICAgICAgICBjb250cm9sID0gYCR7c2VsZi5jb25maWcuYXJpYS5uYW1lfS0ke3NlbGYuY29uZmlnLmFyaWEuY29udGVudH0tJHtpfWA7XG4gICAgICAgICAgICAgICAgaGVhZGVyID0gYCR7c2VsZi5jb25maWcuYXJpYS5uYW1lfS0ke3NlbGYuY29uZmlnLmFyaWEuYnV0dG9ufS0ke2l9YDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYWNjLnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICcnKTtcbiAgICAgICAgICAgIGlmIChlbGVtQ29udGVudCkge1xuICAgICAgICAgICAgICAgIGVsZW1Db250ZW50LnJlbW92ZUF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAnJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZWxmLmNvbmZpZy5hcmlhLm5hbWUpIHtcbiAgICAgICAgICAgICAgICBhY2MucmVtb3ZlQXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJywgJycpO1xuICAgICAgICAgICAgICAgIGFjYy5yZW1vdmVBdHRyaWJ1dGUoJ2lkJywgJycpO1xuICAgICAgICAgICAgICAgIGlmIChlbGVtQ29udGVudCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtQ29udGVudC5yZW1vdmVBdHRyaWJ1dGUoJ2lkJywgJycpO1xuICAgICAgICAgICAgICAgICAgICBlbGVtQ29udGVudC5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtbGFiZWxsZWRieScsICcnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlbGVtQ29udGVudCkge1xuICAgICAgICAgICAgICAgIGVsZW1Db250ZW50LnJlbW92ZUF0dHJpYnV0ZSgncm9sZScsICcnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgYWNjLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2VsZi5oYW5kbGVyc1tpXSk7XG4gICAgICAgICAgICBhY2MucmVtb3ZlRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBzZWxmLmFkZExpc3RlbmVyRm9jdXMpO1xuICAgICAgICAgICAgYWNjLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2JsdXInLCBzZWxmLmFkZExpc3RlbmVyQmx1cik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBhY2NvcmRpb24gPSBzZWxmLnNlbGVjdG9yO1xuICAgICAgICBhY2NvcmRpb24ucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHNlbGYuYWRkS2V5TGlzdGVuZXIpO1xuICAgICAgICBzZWxmLnJlbW92ZVN0eWxlcygpO1xuICAgIH1cblxuICAgIGFjY29yZGlvbk5hdkNsaWNrKGksIGV2KSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICBsZXQgY3VycmVudEl0ZW1DbGlja2VkID0gZXYuY3VycmVudFRhcmdldDtcblxuICAgICAgICBzZWxmLmFjY29yZGlvbkNvbnRlbnRjaGFuZ2UoaSwgY3VycmVudEl0ZW1DbGlja2VkLCBldik7XG5cbiAgICB9XG5cbiAgICBhY2NvcmRpb25Db250ZW50Y2hhbmdlKGksIGVsZW0sIGV2KSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRJdGVtQ2xpY2tlZCA9IGVsZW07XG4gICAgICAgIGNvbnN0IGVsZW1zID0gc2VsZi5pdGVtcztcblxuICAgICAgICBjb25zdCBjdXJyZW50SXRlbSA9IGN1cnJlbnRJdGVtQ2xpY2tlZC5jbG9zZXN0KHNlbGYuY29uZmlnLnNlbGVjdG9ycy5pdGVtKTtcbiAgICAgICAgY29uc3QgY3VycmVudEl0ZW1Db250ZW50ID0gY3VycmVudEl0ZW0ucXVlcnlTZWxlY3RvcihzZWxmLmNvbmZpZy5zZWxlY3RvcnMuY29udGVudCk7XG4gICAgICAgIGNvbnN0IGV4cGFuZGVkID0gY3VycmVudEl0ZW1DbGlja2VkLmdldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcpID09PSAndHJ1ZScgfHwgZmFsc2U7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRJdGVtLmNsYXNzTGlzdC5jb250YWlucyhzZWxmLmNvbmZpZy5jbGFzc2VzLmFjdGl2ZSkpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLmNvbmZpZy5vcHQuY2xvc2UpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5jb25maWcuYW5pbWF0aW9uLmNvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdV9zbGlkZVVwKGN1cnJlbnRJdGVtQ29udGVudCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogc2VsZi5jb25maWcuY2xhc3Nlcy5kaXNwbGF5LFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY3VycmVudEl0ZW0uY2xhc3NMaXN0LnJlbW92ZShzZWxmLmNvbmZpZy5jbGFzc2VzLmFjdGl2ZSk7XG4gICAgICAgICAgICAgICAgY3VycmVudEl0ZW1DbGlja2VkLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsICFleHBhbmRlZCk7XG4gICAgICAgICAgICAgICAgY3VycmVudEl0ZW1Db250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBleHBhbmRlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXNlbGYuY29uZmlnLm9wdC5leHBhbmQpIHtcbiAgICAgICAgICAgICAgICBlbGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW1Db250ZW50ID0gaXRlbS5xdWVyeVNlbGVjdG9yKHNlbGYuY29uZmlnLnNlbGVjdG9ycy5jb250ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXRlbVRyaWdnZXIgPSBpdGVtLnF1ZXJ5U2VsZWN0b3Ioc2VsZi5jb25maWcuc2VsZWN0b3JzLnRyaWdnZXIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZi5jb25maWcuYW5pbWF0aW9uLmNvbnRlbnQpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdV9zbGlkZVVwKGl0ZW1Db250ZW50LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogc2VsZi5jb25maWcuY2xhc3Nlcy5kaXNwbGF5LFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaXRlbS5jbGFzc0xpc3QucmVtb3ZlKHNlbGYuY29uZmlnLmNsYXNzZXMuYWN0aXZlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW1UcmlnZ2VyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtVHJpZ2dlci5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBleHBhbmRlZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW1Db250ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtQ29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgIWV4cGFuZGVkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuY29uZmlnLmFuaW1hdGlvbi5jb250ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHVfc2xpZGVEb3duKGN1cnJlbnRJdGVtQ29udGVudCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogc2VsZi5jb25maWcuY2xhc3Nlcy5kaXNwbGF5LFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjdXJyZW50SXRlbS5jbGFzc0xpc3QuYWRkKHNlbGYuY29uZmlnLmNsYXNzZXMuYWN0aXZlKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50SXRlbUNsaWNrZWQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgIWV4cGFuZGVkKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50SXRlbUNvbnRlbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGV4cGFuZGVkKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuY29uZmlnLmFuaW1hdGlvbi5jb250ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHVfc2xpZGVEb3duKGN1cnJlbnRJdGVtQ29udGVudCwge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogc2VsZi5jb25maWcuY2xhc3Nlcy5kaXNwbGF5XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjdXJyZW50SXRlbS5jbGFzc0xpc3QuYWRkKHNlbGYuY29uZmlnLmNsYXNzZXMuYWN0aXZlKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50SXRlbUNsaWNrZWQuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgIWV4cGFuZGVkKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50SXRlbUNvbnRlbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGV4cGFuZGVkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHNlbGYuY29uZmlnLm9wdC5oYXNHYWxsZXJ5KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5hY2NvcmRpb25DaGFuZ2VHYWxsZXJ5KGkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2VsZi5zaG91bGRTY3JvbGwgJiYgc2VsZi5jdXJyZW50SW5kZXggPCBpKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5zY3JvbGxUb0FjY29yZGlvbihpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnByZXZpb3VzSW5kZXggPSB0aGlzLmN1cnJlbnRJbmRleDtcbiAgICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSBpO1xuXG4gICAgICAgIHNlbGYuZW1pdCgnYWNjb3JkaW9uQ2hhbmdlJywgZXYpO1xuICAgIH1cblxuICAgIG5leHRBY2NvcmRpb24oKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBsZXQgbmV4dEVsZW0gPSBzZWxmLmN1cnJlbnRJbmRleDtcbiAgICAgICAgY29uc3QgbnVtYmVyT2ZFbGVtID0gc2VsZi5pdGVtcy5sZW5ndGg7XG5cbiAgICAgICAgbmV4dEVsZW0gPT09IG51bWJlck9mRWxlbSAtIDEgPyBuZXh0RWxlbSA9IDAgOiBuZXh0RWxlbSArPSAxO1xuICAgICAgICBjb25zdCBuZXh0RWxlbUl0ZW0gPSBzZWxmLml0ZW1zW25leHRFbGVtXTtcblxuICAgICAgICBzZWxmLmFjY29yZGlvbkNvbnRlbnRjaGFuZ2UobmV4dEVsZW0sIG5leHRFbGVtSXRlbSwgbnVsbCk7XG4gICAgfVxuXG4gICAgcHJldkFjY29yZGlvbigpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGxldCBwcmV2RWxlbSA9IHNlbGYuY3VycmVudEluZGV4O1xuICAgICAgICBjb25zdCBudW1iZXJPZkVsZW0gPSBzZWxmLml0ZW1zLmxlbmd0aDtcblxuICAgICAgICBwcmV2RWxlbSA9PT0gMCA/IHByZXZFbGVtID0gbnVtYmVyT2ZFbGVtIC0gMSA6IHByZXZFbGVtIC09IDE7XG4gICAgICAgIGNvbnN0IHByZXZFbGVtSXRlbSA9IHNlbGYuaXRlbXNbcHJldkVsZW1dO1xuXG4gICAgICAgIHNlbGYuYWNjb3JkaW9uQ29udGVudGNoYW5nZShwcmV2RWxlbSwgcHJldkVsZW1JdGVtLCBudWxsKTtcbiAgICB9XG5cbiAgICBhY2NvcmRpb25DaGFuZ2VHYWxsZXJ5KGkpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBsZXQgZ2FsbGVyeUl0ZW1zID0gWy4uLnNlbGYuZ2FsbGVyeUl0ZW1zXTtcblxuICAgICAgICBnYWxsZXJ5SXRlbXMuZm9yRWFjaCgoZ2FsbGVyeSkgPT4ge1xuICAgICAgICAgICAgaWYoc2VsZi5jb25maWcuYW5pbWF0aW9uLmdhbGxlcnkpIHtcbiAgICAgICAgICAgICAgICB1X2ZhZGVPdXQoZ2FsbGVyeSwge1xuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2FsbGVyeS5jbGFzc0xpc3QucmVtb3ZlKHNlbGYuY29uZmlnLmNsYXNzZXMuYWN0aXZlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBuZXdJdGVtID0gZ2FsbGVyeUl0ZW1zW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgdV9mYWRlSW4obmV3SXRlbSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiA1MFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdJdGVtLmNsYXNzTGlzdC5hZGQoc2VsZi5jb25maWcuY2xhc3Nlcy5hY3RpdmUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZ2FsbGVyeS5jbGFzc0xpc3QucmVtb3ZlKHNlbGYuY29uZmlnLmNsYXNzZXMuYWN0aXZlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmKCFzZWxmLmNvbmZpZy5hbmltYXRpb24uZ2FsbGVyeSkge1xuICAgICAgICAgICAgZ2FsbGVyeUl0ZW1zW2ldLmNsYXNzTGlzdC5hZGQoc2VsZi5jb25maWcuY2xhc3Nlcy5hY3RpdmUpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBwcmVwYXJlRm9yQW5pbWF0aW9uKCkge1xuICAgICAgICAvKiBjaGVjayB3aGV0aGVyIGl0ZW1zIGNvbnRhaW5zIGlzLWFjdGl2ZSBjbGFzcywgaWYgaXRzIG5vdCBzdGFydCBjbG9zZWQgYWxsLFxuICAgICAgICBmaXJzdCBpdGVtIHNob3VsZCBoYXZlIGlzLWFjdGl2ZSBjbGFzcyBhbmQgaXRzIGNvbnRlbnQgc2hvdWxkIGJlIHNldCB0b1xuICAgICAgICBkaXNwbGF5IGJsb2NrIC8gZmxleCwgb3RoZXJ3aXNlLCBoaWRlIGl0XG4gICAgICAgICovXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IGl0ZW1zID0gc2VsZi5pdGVtcztcblxuICAgICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgICBsZXQgYWN0aXZlRm91bmQgPSBmYWxzZTtcblxuICAgICAgICBpZiAoc2VsZi5jb25maWcuYW5pbWF0aW9uLmNvbnRlbnQpIHtcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goKGxpc3QsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtQ29udGVudCA9IGxpc3QucXVlcnlTZWxlY3RvcihzZWxmLmNvbmZpZy5zZWxlY3RvcnMuY29udGVudCk7XG5cbiAgICAgICAgICAgICAgICBpZiAobGlzdC5jbGFzc0xpc3QuY29udGFpbnMoc2VsZi5jb25maWcuY2xhc3Nlcy5hY3RpdmUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghc2VsZi5jb25maWcub3B0LnN0YXJ0Q2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbUNvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtQ29udGVudC5zdHlsZS5kaXNwbGF5ID0gc2VsZi5jb25maWcuY2xhc3Nlcy5kaXNwbGF5O1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlRm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpdGVtQ29udGVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXRlbUNvbnRlbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBpZiAoIWFjdGl2ZUZvdW5kICYmICFzZWxmLmNvbmZpZy5vcHQuc3RhcnRDbG9zZWQpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpdGVtMENvbnRlbnQgPSBpdGVtc1swXS5xdWVyeVNlbGVjdG9yKHNlbGYuY29uZmlnLnNlbGVjdG9ycy5jb250ZW50KTtcbiAgICAgICAgICAgICAgICBpdGVtc1swXS5jbGFzc0xpc3QuYWRkKHNlbGYuY29uZmlnLmNsYXNzZXMuYWN0aXZlKTtcbiAgICAgICAgICAgICAgICBpdGVtMENvbnRlbnQuc3R5bGUuZGlzcGxheSA9IHNlbGYuY29uZmlnLmNsYXNzZXMuZGlzcGxheTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlSW5pdEFuaW1hdGlvbigpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBsZXQgaXRlbXMgPSBzZWxmLml0ZW1zO1xuXG4gICAgICAgIGlmKHNlbGYuY29uZmlnLmFuaW1hdGlvbi5jb250ZW50KSB7XG4gICAgICAgICAgICBpdGVtcy5mb3JFYWNoKChsaXN0LCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGl0ZW1Db250ZW50ID0gbGlzdC5xdWVyeVNlbGVjdG9yKHNlbGYuY29uZmlnLnNlbGVjdG9ycy5jb250ZW50KTtcblxuICAgICAgICAgICAgICAgIGlmICghbGlzdC5jbGFzc0xpc3QuY29udGFpbnMoc2VsZi5jb25maWcuY2xhc3Nlcy5hY3RpdmUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1Db250ZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZVN0eWxlcygpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBsZXQgaXRlbXMgPSBzZWxmLml0ZW1zO1xuXG4gICAgICAgIGlmKHNlbGYuY29uZmlnLmFuaW1hdGlvbi5jb250ZW50KSB7XG5cbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goKGxpc3QsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgaXRlbUNvbnRlbnQgPSBsaXN0LnF1ZXJ5U2VsZWN0b3Ioc2VsZi5jb25maWcuc2VsZWN0b3JzLmNvbnRlbnQpO1xuICAgICAgICAgICAgICAgIGl0ZW1Db250ZW50LnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJzZU9wdGlvbnMoKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIGNvbnN0IGlzU2VsZkNsb3NlID0gdV9wYXJzZUJvb2woc2VsZi5zZWxlY3Rvci5nZXRBdHRyaWJ1dGUoc2VsZi5jb25maWcuYXR0ci5jbG9zZSkpXG4gICAgICAgICAgICB8fCBzZWxmLmNvbmZpZy5vcHQuY2xvc2U7XG4gICAgICAgIGlmIChpc1NlbGZDbG9zZSkge1xuICAgICAgICAgICAgaXNTZWxmQ2xvc2UgPyBzZWxmLmNvbmZpZy5vcHQuY2xvc2UgPSB0cnVlIDogc2VsZi5jb25maWcub3B0LmNsb3NlID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogaWYgbGVhdmUgb3BlbiBpcyB0cnVlLCBzZWxmIGNsb3NlIHNob3VsZCBhdXRvbWF0aWNhbGx5IGJlIHRydWUsXG4gICAgICAgICAqIG90aGVyd2lzZSB3ZSB3b250IGJlIGFibGUgdG8gY2xvc2Ugb24gc2VsZiBjbGlja1xuICAgICAgICAgKi9cblxuICAgICAgICBjb25zdCBpc0xlYXZlT3BlbiA9IHVfcGFyc2VCb29sKHNlbGYuc2VsZWN0b3IuZ2V0QXR0cmlidXRlKHNlbGYuY29uZmlnLmF0dHIub3BlbikpXG4gICAgICAgICAgICB8fCBzZWxmLmNvbmZpZy5vcHQuZXhwYW5kO1xuXG4gICAgICAgIGlmIChpc0xlYXZlT3Blbikge1xuICAgICAgICAgICAgc2VsZi5jb25maWcub3B0LmV4cGFuZCA9IHRydWU7XG4gICAgICAgICAgICBzZWxmLmNvbmZpZy5vcHQuY2xvc2UgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5jb25maWcub3B0LmV4cGFuZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNTdGFydENsb3NlZCA9IHVfcGFyc2VCb29sKHNlbGYuc2VsZWN0b3IuZ2V0QXR0cmlidXRlKHNlbGYuY29uZmlnLmF0dHIuc3RhcnRDbG9zZWQpKVxuICAgICAgICAgICAgfHwgc2VsZi5jb25maWcub3B0LnN0YXJ0Q2xvc2VkO1xuXG4gICAgICAgIGlmIChpc1N0YXJ0Q2xvc2VkKSB7XG4gICAgICAgICAgICBzZWxmLmNvbmZpZy5vcHQuc3RhcnRDbG9zZWQgPSB0cnVlO1xuICAgICAgICAgICAgc2VsZi5jb25maWcub3B0LmNsb3NlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlzR2FsbGVyeSA9IHVfcGFyc2VCb29sKHNlbGYuc2VsZWN0b3IuZ2V0QXR0cmlidXRlKHNlbGYuY29uZmlnLmF0dHIuZ2FsbGVyeSkpXG4gICAgICAgICAgICB8fCBzZWxmLmNvbmZpZy5vcHQuaGFzR2FsbGVyeTtcbiAgICAgICAgaWYgKGlzR2FsbGVyeSkge1xuICAgICAgICAgICAgc2VsZi5jb25maWcub3B0Lmhhc0dhbGxlcnkgPSB0cnVlO1xuXG4gICAgICAgICAgICAvLyBpZiB3ZSBoYXZlIGdhbGxlcnksIHNlbGYgY2xvc2UgYW5kIGV4cGFuZCBpcyBieSBkZWZhdWx0IG9mZlxuICAgICAgICAgICAgc2VsZi5jb25maWcub3B0LmV4cGFuZCA9IGZhbHNlO1xuICAgICAgICAgICAgc2VsZi5jb25maWcub3B0LmNsb3NlID0gZmFsc2U7XG4gICAgICAgICAgICBzZWxmLmNvbmZpZy5vcHQuc3RhcnRDbG9zZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFuaW1hdGVDb250ZW50ID0gc2VsZi5zZWxlY3Rvci5nZXRBdHRyaWJ1dGUoc2VsZi5jb25maWcuYXR0ci5hbmltYXRpb25Db250ZW50KTtcblxuICAgICAgICBpZiAoYW5pbWF0ZUNvbnRlbnQpIHtcbiAgICAgICAgICAgIGFuaW1hdGVDb250ZW50ID09PSAnanMnID8gc2VsZi5jb25maWcuYW5pbWF0aW9uLmNvbnRlbnQgPSB0cnVlIDogc2VsZi5jb25maWcuYW5pbWF0aW9uLmNvbnRlbnQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGFuaW1hdGVHYWxsZXJ5ID0gc2VsZi5zZWxlY3Rvci5nZXRBdHRyaWJ1dGUoc2VsZi5jb25maWcuYXR0ci5hbmltYXRpb25HYWxsZXJ5KTtcbiAgICAgICAgaWYgKGFuaW1hdGVHYWxsZXJ5KSB7XG4gICAgICAgICAgICBhbmltYXRlR2FsbGVyeSA9PT0gJ2pzJyA/IHNlbGYuY29uZmlnLmFuaW1hdGlvbi5nYWxsZXJ5ID0gdHJ1ZSA6IHNlbGYuY29uZmlnLmFuaW1hdGlvbi5nYWxsZXJ5ID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkaXNwbGF5ID0gc2VsZi5zZWxlY3Rvci5nZXRBdHRyaWJ1dGUoc2VsZi5jb25maWcuYXR0ci5kaXNwbGF5KVxuICAgICAgICAgICAgfHwgc2VsZi5jb25maWcuY2xhc3Nlcy5kaXNwbGF5O1xuICAgICAgICBzZWxmLmNvbmZpZy5jbGFzc2VzLmRpc3BsYXkgPSBkaXNwbGF5ID09PSAnZmxleCcgPyAnZmxleCcgOiAnYmxvY2snO1xuXG4gICAgICAgIGNvbnN0IGlzU2Nyb2xsVG9WaWV3ID0gdV9wYXJzZUJvb2woXG4gICAgICAgICAgICBzZWxmLnNlbGVjdG9yLmdldEF0dHJpYnV0ZShzZWxmLmNvbmZpZy5hdHRyLnNjcm9sbFRvVmlldyksXG4gICAgICAgICkgfHwgc2VsZi5jb25maWcub3B0LnNjcm9sbFRvVmlldztcbiAgICAgICAgaWYgKGlzU2Nyb2xsVG9WaWV3KSB7XG4gICAgICAgICAgICBzZWxmLmNvbmZpZy5vcHQuc2Nyb2xsVG9WaWV3ID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlbGYuY29uZmlnLm9wdC5leHBhbmQgPSBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYuZW1pdCgnb3B0aW9uc1BhcnNlZCcpO1xuICAgIH1cblxuICAgIC8vIHNtYWxsIGZ1bmN0aW9uIHRvIGNoZWNrIGZvciB2YWxpZCBJRCBvZiB3cmFwcGVyXG4gICAgaXNWYWxpZElkKHMpIHtcbiAgICAgICAgcmV0dXJuIC9eW15cXHNdKyQvLnRlc3Qocyk7XG4gICAgfVxuXG4gICAgZ2V0QXJpYU5hbWUoKSB7XG4gICAgICAgIGxldCBhcmlhTmFtZSA9IHRoaXMud3JhcHBlci5zbGljZSgxKTtcbiAgICAgICAgaWYodGhpcy5pc1ZhbGlkSWQoYXJpYU5hbWUpKSB7XG4gICAgICAgICAgICB0aGlzLmNvbmZpZy5hcmlhLm5hbWUgPSBhcmlhTmFtZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29uZmlnLmFyaWEubmFtZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWRkQXJpYSgpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGVsZW0gPSBzZWxmLnRyaWdnZXI7XG5cbiAgICAgICAgZWxlbS5mb3JFYWNoKChhY2MsIGkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1QYXJlbnQgPSBhY2MuY2xvc2VzdChzZWxmLmNvbmZpZy5zZWxlY3RvcnMuaXRlbSk7XG4gICAgICAgICAgICBjb25zdCBlbGVtQ29udGVudCA9IGVsZW1QYXJlbnQucXVlcnlTZWxlY3RvcihzZWxmLmNvbmZpZy5zZWxlY3RvcnMuY29udGVudCk7XG5cbiAgICAgICAgICAgIGxldCBjb250cm9sLFxuICAgICAgICAgICAgICAgIGhlYWRlcjtcbiAgICAgICAgICAgIGlmIChzZWxmLmNvbmZpZy5hcmlhLm5hbWUpIHtcbiAgICAgICAgICAgICAgICBjb250cm9sID0gYCR7c2VsZi5jb25maWcuYXJpYS5uYW1lfS0ke3NlbGYuY29uZmlnLmFyaWEuY29udGVudH0tJHtpfWA7XG4gICAgICAgICAgICAgICAgaGVhZGVyID0gYCR7c2VsZi5jb25maWcuYXJpYS5uYW1lfS0ke3NlbGYuY29uZmlnLmFyaWEuYnV0dG9ufS0ke2l9YDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGVsZW1QYXJlbnQuY2xhc3NMaXN0LmNvbnRhaW5zKHNlbGYuY29uZmlnLmNsYXNzZXMuYWN0aXZlKSkge1xuICAgICAgICAgICAgICAgIGFjYy5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBpZiAoZWxlbUNvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbUNvbnRlbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFjYy5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1Db250ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1Db250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChzZWxmLmNvbmZpZy5hcmlhLm5hbWUpIHtcbiAgICAgICAgICAgICAgICBhY2Muc2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJywgY29udHJvbCk7XG4gICAgICAgICAgICAgICAgYWNjLnNldEF0dHJpYnV0ZSgnaWQnLCBoZWFkZXIpO1xuICAgICAgICAgICAgICAgIGlmIChlbGVtQ29udGVudCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtQ29udGVudC5zZXRBdHRyaWJ1dGUoJ2lkJywgY29udHJvbCk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1Db250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbGxlZGJ5JywgaGVhZGVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChlbGVtQ29udGVudCkge1xuICAgICAgICAgICAgICAgIGVsZW1Db250ZW50LnNldEF0dHJpYnV0ZSgncm9sZScsICdyZWdpb24nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkTGlzdGVuZXJGb2N1cyhldikge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIGxldCBlbGVtID0gZXYudGFyZ2V0O1xuXG4gICAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChzZWxmLmNvbmZpZy5jbGFzc2VzLmZvY3VzKTtcbiAgICB9XG5cbiAgICBhZGRMaXN0ZW5lckJsdXIoZXYpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBsZXQgZWxlbSA9IGV2LnRhcmdldDtcbiAgICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKHNlbGYuY29uZmlnLmNsYXNzZXMuZm9jdXMpO1xuICAgIH1cblxuICAgIGFkZEtleUxpc3RlbmVyKGV2KSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IGVsZW0gPSBldi50YXJnZXQ7XG4gICAgICAgIGxldCBrZXkgPSBldi53aGljaC50b1N0cmluZygpO1xuXG4gICAgICAgIGxldCB0cmlnZ2VycyA9IFsuLi5zZWxmLnRyaWdnZXJdO1xuXG4gICAgICAgIGxldCB0cmlnZ2VyQ2xhc3MgPSBzZWxmLmNvbmZpZy5zZWxlY3RvcnMudHJpZ2dlci5zbGljZSgxKTtcblxuICAgICAgICAvLyAzMyA9IFBhZ2UgVXAsIDM0ID0gUGFnZSBEb3duXG4gICAgICAgIGxldCBjdHJsTW9kaWZpZXIgPSAoZXYuY3RybEtleSAmJiBrZXkubWF0Y2goLzMzfDM0LykpO1xuXG4gICAgICAgIGlmIChlbGVtLmNsYXNzTGlzdC5jb250YWlucyh0cmlnZ2VyQ2xhc3MpKSB7XG4gICAgICAgICAgICAvLyBVcC8gRG93biBhcnJvdyBhbmQgQ29udHJvbCArIFBhZ2UgVXAvIFBhZ2UgRG93biBrZXlib2FyZCBvcGVyYXRpb25zXG4gICAgICAgICAgICAvLyAzOCA9IFVwLCA0MCA9IERvd25cbiAgICAgICAgICAgIGlmIChrZXkubWF0Y2goLzM4fDQwLykgfHwgY3RybE1vZGlmaWVyKSB7XG4gICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gdHJpZ2dlcnMuaW5kZXhPZihlbGVtKTtcbiAgICAgICAgICAgICAgICBsZXQgZGlyZWN0aW9uID0gKGtleS5tYXRjaCgvMzR8NDAvKSkgPyAxIDogLTE7XG4gICAgICAgICAgICAgICAgbGV0IGxlbmd0aCA9IHRyaWdnZXJzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBsZXQgbmV3SW5kZXggPSAoaW5kZXggKyBsZW5ndGggKyBkaXJlY3Rpb24pICUgbGVuZ3RoO1xuICAgICAgICAgICAgICAgIHRyaWdnZXJzW25ld0luZGV4XS5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoa2V5Lm1hdGNoKC8zNXwzNi8pKSB7XG4gICAgICAgICAgICAgICAgLy8gMzUgPSBFbmQsIDM2ID0gSG9tZSBrZXlib2FyZCBvcGVyYXRpb25zXG4gICAgICAgICAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gR28gdG8gZmlyc3QgYWNjb3JkaW9uXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJzM2JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXJzWzBdLmZvY3VzKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgLy8gR28gdG8gbGFzdCBhY2NvcmRpb25cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnMzUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgdHJpZ2dlcnNbdHJpZ2dlcnMubGVuZ3RoIC0gMV0uZm9jdXMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNjcm9sbFRvQWNjb3JkaW9uKGN1cnJlbnRJbmRleCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgY29uc3QgZWxlbSA9IHNlbGYudHJpZ2dlclswXTtcbiAgICAgICAgY29uc3Qgc2Nyb2xsQ3VycmVudENvbnRlbnQgPSBlbGVtLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCBlbGVtSGVpZ2h0ID0gc2Nyb2xsQ3VycmVudENvbnRlbnQuaGVpZ2h0O1xuICAgICAgICBjb25zdCBvZmZzZXQgPSBlbGVtSGVpZ2h0ICogY3VycmVudEluZGV4O1xuICAgICAgICBjb25zdCBjdXJyZW50U2Nyb2xsUG9zID0gd2luZG93LnNjcm9sbFkgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcbiAgICAgICAgY29uc3Qgc2Nyb2xsVG8gPSBzY3JvbGxDdXJyZW50Q29udGVudC50b3AgKyBjdXJyZW50U2Nyb2xsUG9zICsgb2Zmc2V0IC0gODA7XG5cbiAgICAgICAgc2Nyb2xsVG9VdGlsKHtcbiAgICAgICAgICAgIHRvOiBzY3JvbGxUbyxcbiAgICAgICAgICAgIGR1cmF0aW9uOiA0MDAsXG4gICAgICAgICAgICBlYXNpbmc6IGVhc2VJblF1YWQsXG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBEU01QQWNjb3JkaW9ucztcbiIsImZ1bmN0aW9uIGFqYXhDYWxsKHR5cGUsIHNlZ21lbnQsIHR5cGVPZlVzZSkge1xuICAgIGNvbnN0IGFqYXhEYXRhID0ge1xuICAgICAgICBhY3Rpb246ICdnZXRfZmlsdGVyZWRfcmV0YWlsX2x1YnJpY2FudHMnLFxuICAgICAgICB0eXBlLFxuICAgICAgICBzZWdtZW50LFxuICAgICAgICB0eXBlT2ZVc2UsXG4gICAgfTtcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgdXJsOiBkcy5hamF4X3VybCxcbiAgICAgICAgZGF0YTogYWpheERhdGEsXG4gICAgICAgIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICQoJy5qcy1sdWJyaWNhbnRzLWNvbnRhaW5lcicpLmh0bWwocmVzcG9uc2UuZGF0YS5odG1sKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBkc19yZXRhaWxMdWJyaWNhbnRzRmlsdGVycygpIHtcbiAgICAkKCcuanMtc2VnbWVudCcpLm9uKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgdHlwZSA9IGV2ZW50LnRhcmdldC5kYXRhc2V0LnR5cGVfaWQ7XG4gICAgICAgIGNvbnN0IHNlZ21lbnQgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgIGNvbnN0IHR5cGVPZlVzZSA9ICQoJy5qcy11c2UnKS52YWwoKTtcbiAgICAgICAgYWpheENhbGwodHlwZSwgc2VnbWVudCwgdHlwZU9mVXNlKTtcbiAgICB9KTtcblxuICAgICQoJy5qcy11c2UnKS5vbignY2hhbmdlJywgKGV2KSA9PiB7XG4gICAgICAgIGNvbnN0IHR5cGUgPSAkKCcuanMtc2VnbWVudCcpLmRhdGEoJ3R5cGVfaWQnKTtcbiAgICAgICAgY29uc3QgdHlwZU9mVXNlID0gZXYudGFyZ2V0LnZhbHVlO1xuICAgICAgICBjb25zdCBzZWdtZW50ID0gJCgnLmpzLXNlZ21lbnQnKS52YWwoKTtcbiAgICAgICAgYWpheENhbGwodHlwZSwgc2VnbWVudCwgdHlwZU9mVXNlKTtcbiAgICB9KTtcbn1cbiIsImltcG9ydCBEU01QVGFic0NsYXNzIGZyb20gJy4vRFNNUFRhYnNDbGFzcyc7XG5pbXBvcnQgeyB1X2V4dGVuZE9iamVjdCB9IGZyb20gJy4uLy4uL3V0aWxzL3Vfb2JqZWN0X2V4dGVuZCc7XG5cbmNsYXNzIERTTVBUYWJzRHJvcGRvd24gZXh0ZW5kcyBEU01QVGFic0NsYXNzIHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5kZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIHdyYXBwZXI6ICcuanMtdGFic0Ryb3Atd3JhcHBlcicsXG4gICAgICAgICAgICBzZWxlY3RvcnM6IHtcbiAgICAgICAgICAgICAgICBkcm9wZG93bjogJy5qcy10YWJzLWRyb3Bkb3duJyxcbiAgICAgICAgICAgICAgICBwYW5lbDogJy5qcy10YWJzLXBhbmVsJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbGFzc2VzOiB7XG4gICAgICAgICAgICAgICAgYWN0aXZlOiAnaXMtYWN0aXZlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkYXRhOiAnZGF0YS10YWInLFxuICAgICAgICAgICAgYnJlYWtwb2ludHM6ICd0YWJsZXQnLCAvLyB0YWJsZXQsIGRlc2t0b3AsIGRlc2t0b3AtbCwgYWxsLCAgbGVhdmUgZW1wdHkgZm9yIGRpc2FibGVkXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5jb25maWcgPSB1X2V4dGVuZE9iamVjdCh0aGlzLmRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgICAgICB0aGlzLnNlbGVjdG9yRHJvcGRvd24gPSBgJHt0aGlzLmNvbmZpZy53cmFwcGVyfSAke3RoaXMuY29uZmlnLnNlbGVjdG9ycy5kcm9wZG93bn1gO1xuICAgICAgICB0aGlzLnNlbGVjdG9yUGFuZWxzID0gYCR7dGhpcy5jb25maWcud3JhcHBlcn0gJHt0aGlzLmNvbmZpZy5zZWxlY3RvcnMucGFuZWx9YDtcblxuICAgICAgICB0aGlzLml0ZW1zRHJvcGRvd24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2VsZWN0b3JEcm9wZG93bik7XG4gICAgICAgIHRoaXMucGFuZWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNlbGVjdG9yUGFuZWxzKTtcblxuICAgICAgICBpZiAodGhpcy5jb25maWcuYnJlYWtwb2ludHMgIT09ICdhbGwnKSB7XG4gICAgICAgICAgICB0aGlzLm1xbCA9IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke3RoaXMuYnJlYWtwb2ludHNbdGhpcy5jb25maWcuYnJlYWtwb2ludHNdfXB4KWApO1xuICAgICAgICAgICAgdGhpcy5tZWRpYU1hdGNoID0gdGhpcy5tcWwubWF0Y2hlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubWVkaWFNYXRjaCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuaXRlbXNEcm9wZG93bi5sZW5ndGgpIHJldHVybjtcblxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG5cbiAgICBpbml0KCkge1xuICAgICAgICB0aGlzLmJpbmRGdW5jdGlvbnMoKTtcbiAgICAgICAgdGhpcy5iaW5kVGFic0Ryb3Bkb3duRXZlbnQoKTtcbiAgICAgICAgc3VwZXIuYmluZFRhYlBhbmVsRXZlbnQoKTtcbiAgICB9XG5cbiAgICBiaW5kRnVuY3Rpb25zKCkge1xuICAgICAgICB0aGlzLnRhYkRyb3Bkb3duQ2hhbmdlID0gdGhpcy50YWJEcm9wZG93bkNoYW5nZS5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHN1cGVyLnRhYk5hdkNsaWNrID0gc3VwZXIudGFiTmF2Q2xpY2suYmluZCh0aGlzKTtcbiAgICAgICAgc3VwZXIubWVkaWFNYXRjaGVzID0gc3VwZXIubWVkaWFNYXRjaGVzLmJpbmQodGhpcyk7XG4gICAgICAgIHN1cGVyLm9uU3dpcGVTdGFydCA9IHN1cGVyLm9uU3dpcGVTdGFydC5iaW5kKHRoaXMpO1xuICAgICAgICBzdXBlci5vblN3aXBlRW5kID0gc3VwZXIub25Td2lwZUVuZC5iaW5kKHRoaXMpO1xuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5icmVha3BvaW50cyAhPT0gJ2FsbCcpIHtcbiAgICAgICAgICAgIHRoaXMubXFsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHN1cGVyLm1lZGlhTWF0Y2hlcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kVGFic0Ryb3Bkb3duRXZlbnQoKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBjb25zdCBkcm9wZG93bnMgPSBzZWxmLml0ZW1zRHJvcGRvd247XG5cbiAgICAgICAgZHJvcGRvd25zLmZvckVhY2goKGRyb3Bkb3duKSA9PiB7XG4gICAgICAgICAgICBkcm9wZG93bi5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBzZWxmLnRhYkRyb3Bkb3duQ2hhbmdlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGFiRHJvcGRvd25DaGFuZ2UoZXYpIHtcbiAgICAgICAgY29uc3QgY3VyckRyb3Bkb3duID0gZXYuY3VycmVudFRhcmdldDtcbiAgICAgICAgY29uc3QgY3VycmVudFRhYklEID0gY3VyckRyb3Bkb3duLnZhbHVlO1xuICAgICAgICBjb25zdCBjdXJyZW50SW5kZXggPSBjdXJyRHJvcGRvd24ub3B0aW9ucy5zZWxlY3RlZEluZGV4O1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VyckRyb3Bkb3duLm9wdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGN1cnJEcm9wZG93bi5vcHRpb25zW2ldLnJlbW92ZUF0dHJpYnV0ZSgnc2VsZWN0ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBjdXJyRHJvcGRvd24ub3B0aW9uc1tjdXJyZW50SW5kZXhdLnNldEF0dHJpYnV0ZSgnc2VsZWN0ZWQnLCAnc2VsZWN0ZWQnKTtcblxuICAgICAgICBzdXBlci50YWJQYW5lbENoYW5nZShjdXJyZW50VGFiSUQpO1xuICAgIH1cblxuICAgIHVuYmluZFRhYnNEcm9wZG93bkV2ZW50KCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgY29uc3QgZHJvcGRvd25zID0gc2VsZi5pdGVtc0Ryb3Bkb3duO1xuXG4gICAgICAgIGRyb3Bkb3ducy5mb3JFYWNoKChkcm9wZG93bikgPT4ge1xuICAgICAgICAgICAgZHJvcGRvd24ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgc2VsZi50YWJEcm9wZG93bkNoYW5nZSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBEU01QVGFic0Ryb3Bkb3duO1xuIiwiaW1wb3J0IERTTVBUYWJzQ2xhc3MgZnJvbSAnLi9EU01QVGFic0NsYXNzJztcbmltcG9ydCB7IHVfZXh0ZW5kT2JqZWN0IH0gZnJvbSAnLi4vLi4vdXRpbHMvdV9vYmplY3RfZXh0ZW5kJztcblxuY2xhc3MgRFNNUFRhYnNUYWIgZXh0ZW5kcyBEU01QVGFic0NsYXNzIHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5kZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIHdyYXBwZXI6ICcuanMtdGFicy13cmFwcGVyJyxcbiAgICAgICAgICAgIHNlbGVjdG9yczoge1xuICAgICAgICAgICAgICAgIG5hdjogJy5qcy10YWJzLW5hdi1pdGVtJyxcbiAgICAgICAgICAgICAgICBwYW5lbDogJy5qcy10YWJzLXBhbmVsJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbGFzc2VzOiB7XG4gICAgICAgICAgICAgICAgYWN0aXZlOiAnaXMtYWN0aXZlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkYXRhOiAnZGF0YS10YWInLFxuICAgICAgICAgICAgYnJlYWtwb2ludHM6ICd0YWJsZXQnLCAvLyB0YWJsZXQsIGRlc2t0b3AsIGRlc2t0b3AtbCwgYWxsLCAgbGVhdmUgZW1wdHkgZm9yIGRpc2FibGVkXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5jb25maWcgPSB1X2V4dGVuZE9iamVjdCh0aGlzLmRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgICAgICB0aGlzLnNlbGVjdG9yID0gYCR7dGhpcy5jb25maWcud3JhcHBlcn0gJHt0aGlzLmNvbmZpZy5zZWxlY3RvcnMubmF2fWA7XG4gICAgICAgIHRoaXMuc2VsZWN0b3JQYW5lbHMgPSBgJHt0aGlzLmNvbmZpZy53cmFwcGVyfSAke3RoaXMuY29uZmlnLnNlbGVjdG9ycy5wYW5lbH1gO1xuXG4gICAgICAgIHRoaXMuaXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2VsZWN0b3IpO1xuICAgICAgICB0aGlzLnBhbmVscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5zZWxlY3RvclBhbmVscyk7XG5cbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmJyZWFrcG9pbnRzICE9PSAnYWxsJykge1xuICAgICAgICAgICAgdGhpcy5tcWwgPSB3aW5kb3cubWF0Y2hNZWRpYShgKG1heC13aWR0aDogJHt0aGlzLmJyZWFrcG9pbnRzW3RoaXMuY29uZmlnLmJyZWFrcG9pbnRzXX1weClgKTtcbiAgICAgICAgICAgIHRoaXMubWVkaWFNYXRjaCA9IHRoaXMubXFsLm1hdGNoZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1lZGlhTWF0Y2ggPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLml0ZW1zLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIHN1cGVyLnVuYmluZFRhYlBhbmVsRXZlbnQoKTtcbiAgICAgICAgc3VwZXIudW5iaW5kVGFiTmF2RXZlbnQoKTtcblxuICAgICAgICBpZiAodGhpcy5pdGVtcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IHN1cGVyLmdldE5hdlRhYklEKHRoaXMuaXRlbXNbMF0pO1xuICAgICAgICB9XG4gICAgICAgIHN1cGVyLmJpbmRGdW5jdGlvbnMoKTtcbiAgICAgICAgc3VwZXIuYmluZFRhYk5hdkV2ZW50KCk7XG4gICAgICAgIHN1cGVyLmJpbmRUYWJQYW5lbEV2ZW50KCk7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IERTTVBUYWJzVGFiO1xuIiwiaW1wb3J0IHt1X2V4dGVuZE9iamVjdH0gZnJvbSAnLi4vLi4vdXRpbHMvdV9vYmplY3RfZXh0ZW5kJztcbmltcG9ydCBEU01QVGFic0NsYXNzIGZyb20gJy4vRFNNUFRhYnNDbGFzcyc7XG5cbmNsYXNzIERTTVBUYWJzVGFiRHJvcGRvd24gZXh0ZW5kcyBEU01QVGFic0NsYXNzIHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5kZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIHdyYXBwZXI6ICcuanMtdGFic1RhYkRyb3Atd3JhcHBlcicsXG4gICAgICAgICAgICBzZWxlY3RvcnM6IHtcbiAgICAgICAgICAgICAgICBuYXY6ICcuanMtdGFicy1uYXYtaXRlbScsXG4gICAgICAgICAgICAgICAgZHJvcGRvd246ICcuanMtdGFicy1kcm9wZG93bicsXG4gICAgICAgICAgICAgICAgcGFuZWw6ICcuanMtdGFicy1wYW5lbCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xhc3Nlczoge1xuICAgICAgICAgICAgICAgIGFjdGl2ZTogJ2lzLWFjdGl2ZScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGF0YTogJ2RhdGEtdGFiJyxcbiAgICAgICAgICAgIGJyZWFrcG9pbnRzOiAndGFibGV0JywgLy8gdGFibGV0LCBkZXNrdG9wLCBkZXNrdG9wLWwsIGFsbCwgIGxlYXZlIGVtcHR5IGZvciBkaXNhYmxlZFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuY29uZmlnID0gdV9leHRlbmRPYmplY3QodGhpcy5kZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICAgICAgdGhpcy5zZWxlY3RvclRhYnMgPSBgJHt0aGlzLmNvbmZpZy53cmFwcGVyfSAke3RoaXMuY29uZmlnLnNlbGVjdG9ycy5uYXZ9YDtcbiAgICAgICAgdGhpcy5zZWxlY3RvckRyb3Bkb3duID0gYCR7dGhpcy5jb25maWcud3JhcHBlcn0gJHt0aGlzLmNvbmZpZy5zZWxlY3RvcnMuZHJvcGRvd259YDtcbiAgICAgICAgdGhpcy5zZWxlY3RvclBhbmVscyA9IGAke3RoaXMuY29uZmlnLndyYXBwZXJ9ICR7dGhpcy5jb25maWcuc2VsZWN0b3JzLnBhbmVsfWA7XG5cbiAgICAgICAgdGhpcy5pdGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwodGhpcy5zZWxlY3RvclRhYnMpO1xuICAgICAgICB0aGlzLml0ZW1zRHJvcGRvd24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuc2VsZWN0b3JEcm9wZG93bik7XG4gICAgICAgIHRoaXMucGFuZWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCh0aGlzLnNlbGVjdG9yUGFuZWxzKTtcblxuICAgICAgICBpZiAodGhpcy5jb25maWcuYnJlYWtwb2ludHMgIT09ICdhbGwnKSB7XG4gICAgICAgICAgICB0aGlzLm1xbCA9IHdpbmRvdy5tYXRjaE1lZGlhKGAobWF4LXdpZHRoOiAke3RoaXMuYnJlYWtwb2ludHNbdGhpcy5jb25maWcuYnJlYWtwb2ludHNdfXB4KWApO1xuICAgICAgICAgICAgdGhpcy5tZWRpYU1hdGNoID0gdGhpcy5tcWwubWF0Y2hlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubWVkaWFNYXRjaCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuaXRlbXMubGVuZ3RoKSByZXR1cm47XG5cbiAgICAgICAgdGhpcy5pbml0VGFic0Ryb3Bkb3duKCk7XG4gICAgfVxuXG4gICAgaW5pdFRhYnNEcm9wZG93bigpIHtcbiAgICAgICAgaWYgKHRoaXMuaXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSBzdXBlci5nZXROYXZUYWJJRCh0aGlzLml0ZW1zWzBdKTtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlTmF2ID0gdGhpcy5pdGVtc1swXTtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlUGFuZWwgPSB0aGlzLnBhbmVsc1swXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJpbmRGdW5jdGlvbnMoKTtcbiAgICAgICAgdGhpcy5iaW5kVGFiTmF2RXYoKTtcbiAgICAgICAgdGhpcy5iaW5kVGFic0Ryb3Bkb3duRXZlbnQoKTtcbiAgICAgICAgc3VwZXIuYmluZFRhYlBhbmVsRXZlbnQoKTtcbiAgICB9XG5cbiAgICBiaW5kRnVuY3Rpb25zKCkge1xuICAgICAgICB0aGlzLnRhYkRyb3Bkb3duQ2hhbmdlID0gdGhpcy50YWJEcm9wZG93bkNoYW5nZS5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLnRhYk5hdkNsaWNrID0gdGhpcy50YWJOYXZDbGljay5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm1lZGlhTWF0Y2hlcyA9IHRoaXMubWVkaWFNYXRjaGVzLmJpbmQodGhpcyk7XG4gICAgICAgIHN1cGVyLm9uU3dpcGVTdGFydCA9IHN1cGVyLm9uU3dpcGVTdGFydC5iaW5kKHRoaXMpO1xuICAgICAgICBzdXBlci5vblN3aXBlRW5kID0gc3VwZXIub25Td2lwZUVuZC5iaW5kKHRoaXMpO1xuXG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5icmVha3BvaW50cyAhPT0gJ2FsbCcpIHtcbiAgICAgICAgICAgIHRoaXMubXFsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRoaXMubWVkaWFNYXRjaGVzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJpbmRUYWJzRHJvcGRvd25FdmVudCgpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGRyb3Bkb3ducyA9IHNlbGYuaXRlbXNEcm9wZG93bjtcblxuICAgICAgICBkcm9wZG93bnMuZm9yRWFjaCgoZHJvcGRvd24pID0+IHtcbiAgICAgICAgICAgIGRyb3Bkb3duLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHNlbGYudGFiRHJvcGRvd25DaGFuZ2UpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBtZWRpYU1hdGNoZXMoZSkge1xuICAgICAgICB0aGlzLm1lZGlhTWF0Y2ggPSBlLm1hdGNoZXM7XG5cbiAgICAgICAgaWYgKHRoaXMubWVkaWFNYXRjaCkge1xuICAgICAgICAgICAgc3VwZXIuYmluZFRhYlBhbmVsRXZlbnQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN1cGVyLnVuYmluZFRhYlBhbmVsRXZlbnQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJpbmRUYWJOYXZFdigpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGVsZW0gPSBzZWxmLml0ZW1zO1xuXG4gICAgICAgIGVsZW0uZm9yRWFjaCgodGFiKSA9PiB7XG4gICAgICAgICAgICB0YWIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzZWxmLnRhYk5hdkNsaWNrLCB7IHBhc3NpdmU6IHRydWUgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHRhYk5hdkNsaWNrKGV2KSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBjb25zdCBjdXJyZW50VGFiID0gZXYuY3VycmVudFRhcmdldDtcbiAgICAgICAgY29uc3QgY3VycmVudFRhYklEID0gc3VwZXIuZ2V0TmF2VGFiSUQoY3VycmVudFRhYik7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3RvciA9IGN1cnJlbnRUYWIuY2xvc2VzdChzZWxmLmNvbmZpZy53cmFwcGVyKTtcbiAgICAgICAgY29uc3QgY3VycmVudERyb3Bkb3duID0gY3VycmVudFNlbGVjdG9yLnF1ZXJ5U2VsZWN0b3Ioc2VsZi5jb25maWcuc2VsZWN0b3JzLmRyb3Bkb3duKTtcblxuICAgICAgICBsZXQgbmV3SW5kZXg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3VycmVudERyb3Bkb3duLm9wdGlvbnMubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50RHJvcGRvd24ub3B0aW9uc1tpXS52YWx1ZSA9PT0gY3VycmVudFRhYklEKSB7XG4gICAgICAgICAgICAgICAgbmV3SW5kZXggPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi51cGRhdGVUYWJOYXYoY3VycmVudFRhYik7XG4gICAgICAgIHNlbGYudXBkYXRlRHJvcGRvd24oY3VycmVudERyb3Bkb3duLCBuZXdJbmRleCk7XG4gICAgICAgIHN1cGVyLnRhYlBhbmVsQ2hhbmdlKGN1cnJlbnRUYWJJRCk7XG4gICAgfVxuXG4gICAgdGFiRHJvcGRvd25DaGFuZ2UoZXYpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGN1cnJEcm9wZG93biA9IGV2LmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IGN1cnJEcm9wZG93bi5vcHRpb25zLnNlbGVjdGVkSW5kZXg7XG5cbiAgICAgICAgY29uc3QgY3VycmVudFRhYklEID0gY3VyckRyb3Bkb3duLnZhbHVlO1xuICAgICAgICBjb25zdCBjdXJyZW50TmF2SXRlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFske3NlbGYuY29uZmlnLmRhdGF9PScke2N1cnJlbnRUYWJJRH0nXWApO1xuXG4gICAgICAgIHNlbGYudXBkYXRlRHJvcGRvd24oY3VyckRyb3Bkb3duLCBjdXJyZW50SW5kZXgpO1xuICAgICAgICBzZWxmLnVwZGF0ZVRhYk5hdihjdXJyZW50TmF2SXRlbSk7XG4gICAgICAgIHN1cGVyLnRhYlBhbmVsQ2hhbmdlKGN1cnJlbnRUYWJJRCk7XG4gICAgfVxuXG4gICAgdXBkYXRlRHJvcGRvd24oY3VycmVudERyb3AsIG5ld0Ryb3BJbmRleCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgY29uc3QgY3VyckRyb3Bkb3duID0gY3VycmVudERyb3A7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IG5ld0Ryb3BJbmRleDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJEcm9wZG93bi5vcHRpb25zLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjdXJyRHJvcGRvd24ub3B0aW9uc1tpXS5yZW1vdmVBdHRyaWJ1dGUoJ3NlbGVjdGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgY3VyckRyb3Bkb3duLm9wdGlvbnNbY3VycmVudEluZGV4XS5zZXRBdHRyaWJ1dGUoJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyk7XG4gICAgICAgIGN1cnJEcm9wZG93bi5vcHRpb25zLnNlbGVjdGVkSW5kZXggPSBjdXJyZW50SW5kZXg7XG4gICAgfVxuXG4gICAgdXBkYXRlVGFiTmF2KGN1cnJUYWIpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRUYWIgPSBjdXJyVGFiO1xuICAgICAgICBzZWxmLmFjdGl2ZU5hdiA9IGN1cnJUYWI7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3RvciA9IGN1cnJlbnRUYWIuY2xvc2VzdChzZWxmLmNvbmZpZy53cmFwcGVyKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IGN1cnJlbnRTZWxlY3Rvci5xdWVyeVNlbGVjdG9yQWxsKHNlbGYuY29uZmlnLnNlbGVjdG9ycy5uYXYpO1xuXG4gICAgICAgIHN1cGVyLmNsZWFyQWN0aXZlQ2xhc3MoZWxlbSwgJ25hdicpO1xuICAgICAgICBzdXBlci5zZXRBY3RpdmVDbGFzcyhjdXJyZW50VGFiLCAnbmF2Jyk7XG4gICAgfVxuXG4gICAgdW5iaW5kVGFic0Ryb3BFdmVudHMoKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBjb25zdCBkcm9wZG93bnMgPSBzZWxmLml0ZW1zRHJvcGRvd247XG4gICAgICAgIGNvbnN0IGVsZW0gPSBzZWxmLml0ZW1zO1xuICAgICAgICBjb25zdCB7IHBhbmVscyB9ID0gc2VsZjtcblxuICAgICAgICBlbGVtLmZvckVhY2goKHRhYikgPT4ge1xuICAgICAgICAgICAgdGFiLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2VsZi50YWJOYXZDbGljayk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHBhbmVscy5mb3JFYWNoKChwYW5lbCkgPT4ge1xuICAgICAgICAgICAgcGFuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc2VsZi5vblN3aXBlU3RhcnQpO1xuICAgICAgICAgICAgcGFuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHNlbGYub25Td2lwZVN0YXJ0KTtcbiAgICAgICAgICAgIHBhbmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBzZWxmLm9uU3dpcGVFbmQpO1xuICAgICAgICAgICAgcGFuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBzZWxmLm9uU3dpcGVFbmQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBkcm9wZG93bnMuZm9yRWFjaCgoZHJvcGRvd24pID0+IHtcbiAgICAgICAgICAgIGRyb3Bkb3duLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHNlbGYudGFiRHJvcGRvd25DaGFuZ2UpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBuZXh0VGFiKCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgY29uc3QgeyBpdGVtcyB9ID0gc2VsZjtcbiAgICAgICAgY29uc3QgY3VycmVudEl0ZW0gPSBzZWxmLmN1cnJlbnRJbmRleDtcbiAgICAgICAgY29uc3QgbnVtYmVyT2ZFbGVtID0gc2VsZi5pdGVtcy5sZW5ndGg7XG4gICAgICAgIGxldCBmb3VuZEluZGV4ID0gMDtcbiAgICAgICAgbGV0IG5leHRFbGVtO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRUYWIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbJHtzZWxmLmNvbmZpZy5kYXRhfT0nJHtjdXJyZW50SXRlbX0nXWApO1xuICAgICAgICBjb25zdCBjdXJyZW50U2VsZWN0b3IgPSBjdXJyZW50VGFiLmNsb3Nlc3Qoc2VsZi5jb25maWcud3JhcHBlcik7XG4gICAgICAgIGNvbnN0IGN1cnJlbnREcm9wZG93biA9IGN1cnJlbnRTZWxlY3Rvci5xdWVyeVNlbGVjdG9yKHNlbGYuY29uZmlnLnNlbGVjdG9ycy5kcm9wZG93bik7XG5cbiAgICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXRlbUlEID0gc2VsZi5nZXROYXZUYWJJRChpdGVtKTtcbiAgICAgICAgICAgIGlmIChpdGVtSUQgPT09IGN1cnJlbnRJdGVtKSB7XG4gICAgICAgICAgICAgICAgZm91bmRJbmRleCA9IGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmIChmb3VuZEluZGV4IDwgbnVtYmVyT2ZFbGVtIC0gMSkge1xuICAgICAgICAgICAgc2VsZi5jaGFuZ2VBY3RpdmVUYWIoZm91bmRJbmRleCArIDEpO1xuICAgICAgICAgICAgc2VsZi51cGRhdGVEcm9wZG93bihjdXJyZW50RHJvcGRvd24sIGZvdW5kSW5kZXggKyAxKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByZXZUYWIoKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBjb25zdCB7IGl0ZW1zIH0gPSBzZWxmO1xuICAgICAgICBjb25zdCBjdXJyZW50SXRlbSA9IHNlbGYuY3VycmVudEluZGV4O1xuICAgICAgICBjb25zdCBudW1iZXJPZkVsZW0gPSBzZWxmLml0ZW1zLmxlbmd0aDtcbiAgICAgICAgbGV0IGZvdW5kSW5kZXggPSAwO1xuICAgICAgICBsZXQgcHJldkVsZW07XG5cbiAgICAgICAgY29uc3QgY3VycmVudFRhYiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFske3NlbGYuY29uZmlnLmRhdGF9PScke2N1cnJlbnRJdGVtfSddYCk7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3RvciA9IGN1cnJlbnRUYWIuY2xvc2VzdChzZWxmLmNvbmZpZy53cmFwcGVyKTtcbiAgICAgICAgY29uc3QgY3VycmVudERyb3Bkb3duID0gY3VycmVudFNlbGVjdG9yLnF1ZXJ5U2VsZWN0b3Ioc2VsZi5jb25maWcuc2VsZWN0b3JzLmRyb3Bkb3duKTtcblxuICAgICAgICBpdGVtcy5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpdGVtSUQgPSBzZWxmLmdldE5hdlRhYklEKGl0ZW0pO1xuICAgICAgICAgICAgaWYgKGl0ZW1JRCA9PT0gY3VycmVudEl0ZW0pIHtcbiAgICAgICAgICAgICAgICBmb3VuZEluZGV4ID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGZvdW5kSW5kZXggPiAwKSB7XG4gICAgICAgICAgICBzZWxmLmNoYW5nZUFjdGl2ZVRhYihmb3VuZEluZGV4IC0gMSk7XG4gICAgICAgICAgICBzZWxmLnVwZGF0ZURyb3Bkb3duKGN1cnJlbnREcm9wZG93biwgZm91bmRJbmRleCAtIDEpO1xuICAgICAgICB9XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IERTTVBUYWJzVGFiRHJvcGRvd247XG4iLCJjbGFzcyBEU01QVGFic0NsYXNzIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmV2ZW50c0xpc3RlbmVycyA9IHt9O1xuICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IDA7XG4gICAgICAgIHRoaXMuYWN0aXZlTmF2ID0gbnVsbDtcbiAgICAgICAgdGhpcy5hY3RpdmVQYW5lbCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5icmVha3BvaW50cyA9IHtcbiAgICAgICAgICAgIHRhYmxldDogNzY4LFxuICAgICAgICAgICAgZGVza3RvcDogMTExMixcbiAgICAgICAgICAgICdkZXNrdG9wLWwnOiAxNDQwLFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuYnJlYWtwb2ludCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGJpbmRGdW5jdGlvbnMoKSB7XG4gICAgICAgIHRoaXMudGFiTmF2Q2xpY2sgPSB0aGlzLnRhYk5hdkNsaWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMubWVkaWFNYXRjaGVzID0gdGhpcy5tZWRpYU1hdGNoZXMuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5vblN3aXBlU3RhcnQgPSB0aGlzLm9uU3dpcGVTdGFydC5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLm9uU3dpcGVFbmQgPSB0aGlzLm9uU3dpcGVFbmQuYmluZCh0aGlzKTtcblxuICAgICAgICBpZiAodGhpcy5jb25maWcuYnJlYWtwb2ludHMgIT09ICdhbGwnKSB7XG4gICAgICAgICAgICB0aGlzLm1xbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB0aGlzLm1lZGlhTWF0Y2hlcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBtZWRpYU1hdGNoZXMoZSkge1xuICAgICAgICB0aGlzLm1lZGlhTWF0Y2ggPSBlLm1hdGNoZXM7XG5cbiAgICAgICAgaWYgKHRoaXMubWVkaWFNYXRjaCkge1xuICAgICAgICAgICAgdGhpcy5iaW5kVGFiUGFuZWxFdmVudCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51bmJpbmRUYWJQYW5lbEV2ZW50KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kVGFiTmF2RXZlbnQoKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBjb25zdCBlbGVtID0gc2VsZi5pdGVtcztcblxuICAgICAgICBlbGVtLmZvckVhY2goKHRhYikgPT4ge1xuICAgICAgICAgICAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2VsZi50YWJOYXZDbGljaywgeyBwYXNzaXZlOiB0cnVlIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBiaW5kVGFiUGFuZWxFdmVudCgpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHsgcGFuZWxzIH0gPSBzZWxmO1xuXG4gICAgICAgIGlmIChzZWxmLm1lZGlhTWF0Y2gpIHtcbiAgICAgICAgICAgIHBhbmVscy5mb3JFYWNoKChwYW5lbCkgPT4ge1xuICAgICAgICAgICAgICAgIHBhbmVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHNlbGYub25Td2lwZVN0YXJ0KTtcbiAgICAgICAgICAgICAgICBwYW5lbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgc2VsZi5vblN3aXBlU3RhcnQpO1xuICAgICAgICAgICAgICAgIHBhbmVsLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBzZWxmLm9uU3dpcGVFbmQpO1xuICAgICAgICAgICAgICAgIHBhbmVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgc2VsZi5vblN3aXBlRW5kKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kVGFiUGFuZWxFdmVudCgpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHsgcGFuZWxzIH0gPSBzZWxmO1xuXG4gICAgICAgIHBhbmVscy5mb3JFYWNoKChwYW5lbCkgPT4ge1xuICAgICAgICAgICAgcGFuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc2VsZi5vblN3aXBlU3RhcnQpO1xuICAgICAgICAgICAgcGFuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHNlbGYub25Td2lwZVN0YXJ0KTtcbiAgICAgICAgICAgIHBhbmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBzZWxmLm9uU3dpcGVFbmQpO1xuICAgICAgICAgICAgcGFuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBzZWxmLm9uU3dpcGVFbmQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB1bmJpbmRUYWJOYXZFdmVudCgpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnN0IGVsZW0gPSBzZWxmLml0ZW1zO1xuICAgICAgICBjb25zdCB7IHBhbmVscyB9ID0gc2VsZjtcblxuICAgICAgICBlbGVtLmZvckVhY2goKHRhYikgPT4ge1xuICAgICAgICAgICAgdGFiLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2VsZi50YWJOYXZDbGljayk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHBhbmVscy5mb3JFYWNoKChwYW5lbCkgPT4ge1xuICAgICAgICAgICAgcGFuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc2VsZi5vblN3aXBlU3RhcnQpO1xuICAgICAgICAgICAgcGFuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHNlbGYub25Td2lwZVN0YXJ0KTtcbiAgICAgICAgICAgIHBhbmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBzZWxmLm9uU3dpcGVFbmQpO1xuICAgICAgICAgICAgcGFuZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBzZWxmLm9uU3dpcGVFbmQpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy5jb25maWcuYnJlYWtwb2ludHMgIT09ICdhbGwnKSB7XG4gICAgICAgICAgICBzZWxmLm1xbC5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBzZWxmLm1lZGlhTWF0Y2hlcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0YWJOYXZDbGljayhldikge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgY29uc3QgY3VycmVudFRhYiA9IGV2LmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgIHNlbGYuYWN0aXZlTmF2ID0gZXYuY3VycmVudFRhcmdldDtcbiAgICAgICAgY29uc3QgY3VycmVudFNlbGVjdG9yID0gY3VycmVudFRhYi5jbG9zZXN0KHNlbGYuY29uZmlnLndyYXBwZXIpO1xuICAgICAgICBjb25zdCBlbGVtID0gY3VycmVudFNlbGVjdG9yLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZi5jb25maWcuc2VsZWN0b3JzLm5hdik7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRUYWJJRCA9IHNlbGYuZ2V0TmF2VGFiSUQoY3VycmVudFRhYik7XG5cbiAgICAgICAgc2VsZi5jbGVhckFjdGl2ZUNsYXNzKGVsZW0sICduYXYnKTtcbiAgICAgICAgc2VsZi5zZXRBY3RpdmVDbGFzcyhjdXJyZW50VGFiLCAnbmF2Jyk7XG4gICAgICAgIHNlbGYudGFiUGFuZWxDaGFuZ2UoY3VycmVudFRhYklEKTtcbiAgICB9XG5cbiAgICB0YWJQYW5lbENoYW5nZShpbmRleCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcblxuICAgICAgICBpZiAodHlwZW9mIGluZGV4ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGN1cnJlbnRQYW5lbElEID0gYCR7c2VsZi5jb25maWcuZGF0YX0tJHtpbmRleH1gO1xuICAgICAgICBjb25zdCBjdXJyZW50UGFuZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjJHtjdXJyZW50UGFuZWxJRH1gKTtcbiAgICAgICAgc2VsZi5hY3RpdmVQYW5lbCA9IGN1cnJlbnRQYW5lbDtcbiAgICAgICAgY29uc3QgY3VycmVudFBhbmVsSG9sZGVyID0gY3VycmVudFBhbmVsLmNsb3Nlc3Qoc2VsZi5jb25maWcud3JhcHBlcik7XG4gICAgICAgIGNvbnN0IGVsZW0gPSBjdXJyZW50UGFuZWxIb2xkZXIucXVlcnlTZWxlY3RvckFsbChzZWxmLmNvbmZpZy5zZWxlY3RvcnMucGFuZWwpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgY3VycmVudFBhbmVsID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5jbGVhckFjdGl2ZUNsYXNzKGVsZW0sICdwYW5lbCcpO1xuICAgICAgICBzZWxmLnNldEFjdGl2ZUNsYXNzKGN1cnJlbnRQYW5lbCwgJ3BhbmVsJyk7XG4gICAgICAgIHNlbGYuY3VycmVudEluZGV4ID0gaW5kZXg7XG4gICAgICAgIHNlbGYuZW1pdCgndGFic0NoYW5nZScpO1xuICAgIH1cblxuICAgIGdldE5hdlRhYklEKGluZGV4KSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBjb25zdCBkYXRhSUQgPSBpbmRleC5nZXRBdHRyaWJ1dGUoc2VsZi5jb25maWcuZGF0YSk7XG4gICAgICAgIHJldHVybiBkYXRhSUQ7XG4gICAgfVxuXG4gICAgY2xlYXJBY3RpdmVDbGFzcyhlbGVtLCBzZWN0aW9uKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBlbGVtLmZvckVhY2goKHRhYikgPT4ge1xuICAgICAgICAgICAgdGFiLmNsYXNzTGlzdC5yZW1vdmUoc2VsZi5jb25maWcuY2xhc3Nlcy5hY3RpdmUpO1xuXG4gICAgICAgICAgICBpZiAoc2VjdGlvbiA9PT0gJ3BhbmVsJykge1xuICAgICAgICAgICAgICAgIHRhYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VjdGlvbiA9PT0gJ25hdicpIHtcbiAgICAgICAgICAgICAgICB0YWIuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzZXRBY3RpdmVDbGFzcyhlbGVtLCBzZWN0aW9uKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoc2VsZi5jb25maWcuY2xhc3Nlcy5hY3RpdmUpO1xuICAgICAgICBpZiAoc2VjdGlvbiA9PT0gJ3BhbmVsJykge1xuICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZWN0aW9uID09PSAnbmF2Jykge1xuICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCB0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoYW5nZUFjdGl2ZVRhYihpID0gMCkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgY29uc3QgZWxlbXMgPSBzZWxmLml0ZW1zO1xuICAgICAgICBjb25zdCBjdXJyZW50VGFiID0gZWxlbXNbaV07XG4gICAgICAgIGNvbnN0IGN1cnJlbnRTZWxlY3RvciA9IGN1cnJlbnRUYWIuY2xvc2VzdChzZWxmLmNvbmZpZy53cmFwcGVyKTtcbiAgICAgICAgY29uc3QgZWxlbSA9IGN1cnJlbnRTZWxlY3Rvci5xdWVyeVNlbGVjdG9yQWxsKHNlbGYuY29uZmlnLnNlbGVjdG9ycy5uYXYpO1xuICAgICAgICBjb25zdCBjdXJyZW50VGFiSUQgPSBzZWxmLmdldE5hdlRhYklEKGN1cnJlbnRUYWIpO1xuXG4gICAgICAgIHNlbGYuYWN0aXZlTmF2ID0gY3VycmVudFRhYjtcbiAgICAgICAgc2VsZi5jbGVhckFjdGl2ZUNsYXNzKGVsZW0sICduYXYnKTtcbiAgICAgICAgc2VsZi5zZXRBY3RpdmVDbGFzcyhjdXJyZW50VGFiLCAnbmF2Jyk7XG4gICAgICAgIHNlbGYudGFiUGFuZWxDaGFuZ2UoY3VycmVudFRhYklEKTtcbiAgICB9XG5cbiAgICBvbihldmVudHMsIGNhbGxiYWNrKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSByZXR1cm47XG5cbiAgICAgICAgZXZlbnRzLnNwbGl0KCcgJykuZm9yRWFjaCgoZXZlbnQsIGkpID0+IHtcbiAgICAgICAgICAgIGlmICghc2VsZi5ldmVudHNMaXN0ZW5lcnNbZXZlbnRdKSBzZWxmLmV2ZW50c0xpc3RlbmVyc1tldmVudF0gPSBbXTtcbiAgICAgICAgICAgIHNlbGYuZXZlbnRzTGlzdGVuZXJzW2V2ZW50XS5wdXNoKGNhbGxiYWNrKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgb2ZmKGV2ZW50cywgaGFuZGxlcikge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgaWYgKCFzZWxmLmV2ZW50c0xpc3RlbmVycykgcmV0dXJuO1xuICAgICAgICBldmVudHMuc3BsaXQoJyAnKS5mb3JFYWNoKChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHNlbGYuZXZlbnRzTGlzdGVuZXJzW2V2ZW50XSA9IFtdO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLmV2ZW50c0xpc3RlbmVyc1tldmVudF0pIHtcbiAgICAgICAgICAgICAgICBzZWxmLmV2ZW50c0xpc3RlbmVyc1tldmVudF0uZm9yRWFjaCgoZXZlbnRIYW5kbGVyLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnRIYW5kbGVyID09PSBoYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmV2ZW50c0xpc3RlbmVyc1tldmVudF0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBlbWl0KC4uLmFyZ3MpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCFzZWxmLmV2ZW50c0xpc3RlbmVycykgcmV0dXJuIHNlbGY7XG4gICAgICAgIGxldCBldmVudHM7XG4gICAgICAgIGxldCBkYXRhO1xuICAgICAgICBsZXQgY29udGV4dDtcblxuICAgICAgICBpZiAodHlwZW9mIGFyZ3NbMF0gPT09ICdzdHJpbmcnIHx8IEFycmF5LmlzQXJyYXkoYXJnc1swXSkpIHtcbiAgICAgICAgICAgIGV2ZW50cyA9IGFyZ3NbMF07XG4gICAgICAgICAgICBkYXRhID0gYXJncy5zbGljZSgxLCBhcmdzLmxlbmd0aCk7XG4gICAgICAgICAgICBjb250ZXh0ID0gc2VsZjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV2ZW50cyA9IGFyZ3NbMF0uZXZlbnRzO1xuICAgICAgICAgICAgZGF0YSA9IGFyZ3NbMF0uZGF0YTtcbiAgICAgICAgICAgIGNvbnRleHQgPSBhcmdzWzBdLmNvbnRleHQgfHwgc2VsZjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGV2ZW50cywgZGF0YSwgY29udGV4dCk7XG4gICAgICAgIGRhdGEudW5zaGlmdChjb250ZXh0KTtcbiAgICAgICAgY29uc3QgZXZlbnRzQXJyYXkgPSBBcnJheS5pc0FycmF5KGV2ZW50cykgPyBldmVudHMgOiBldmVudHMuc3BsaXQoJyAnKTtcblxuICAgICAgICBldmVudHNBcnJheS5mb3JFYWNoKChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHNlbGYuZXZlbnRzTGlzdGVuZXJzICYmIHNlbGYuZXZlbnRzTGlzdGVuZXJzW2V2ZW50XSkge1xuICAgICAgICAgICAgICAgIHNlbGYuZXZlbnRzTGlzdGVuZXJzW2V2ZW50XS5mb3JFYWNoKChldmVudEhhbmRsZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRIYW5kbGVyLmFwcGx5KGNvbnRleHQsIGRhdGEpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvblN3aXBlU3RhcnQoZSkge1xuICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgc2VsZi5zd2lwZVN0YXJ0ID0gZS5wYWdlWCB8fCBlLnRhcmdldFRvdWNoZXNbMF0ucGFnZVg7XG4gICAgfVxuXG4gICAgb25Td2lwZUVuZChlKSB7XG4gICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBjb25zdCBwYWdlWCA9IGUucGFnZVggfHwgZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWDtcbiAgICAgICAgbGV0IG9mZnNldDtcblxuICAgICAgICBpZiAoc2VsZi5zd2lwZVN0YXJ0KSB7XG4gICAgICAgICAgICBvZmZzZXQgPSBzZWxmLnN3aXBlU3RhcnQgLSBwYWdlWDtcblxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKG9mZnNldCkgPiAzMCkge1xuICAgICAgICAgICAgICAgIGlmIChvZmZzZXQgPiAzMCkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm5leHRUYWIoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAob2Zmc2V0IDwgLTMwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucHJldlRhYigpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBzZWxmLnN3aXBlU3RhcnQgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmV4dFRhYigpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHsgaXRlbXMgfSA9IHNlbGY7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRJdGVtID0gc2VsZi5jdXJyZW50SW5kZXg7XG4gICAgICAgIGNvbnN0IG51bWJlck9mRWxlbSA9IHNlbGYuaXRlbXMubGVuZ3RoO1xuICAgICAgICBsZXQgZm91bmRJbmRleCA9IDA7XG4gICAgICAgIGxldCBuZXh0RWxlbTtcbiAgICAgICAgXG4gICAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1JRCA9IHNlbGYuZ2V0TmF2VGFiSUQoaXRlbSk7XG4gICAgICAgICAgICBpZiAoaXRlbUlEID09PSBjdXJyZW50SXRlbSkge1xuICAgICAgICAgICAgICAgIGZvdW5kSW5kZXggPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoZm91bmRJbmRleCA8IG51bWJlck9mRWxlbSAtIDEpIHtcbiAgICAgICAgICAgIHNlbGYuY2hhbmdlQWN0aXZlVGFiKGZvdW5kSW5kZXggKyAxKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGZvdW5kSW5kZXggPT09IG51bWJlck9mRWxlbSAtIDEgPyBuZXh0RWxlbSA9IDAgOiBuZXh0RWxlbSA9IGZvdW5kSW5kZXggKyAxO1xuICAgICAgICAvLyBzZWxmLmNoYW5nZUFjdGl2ZVRhYihuZXh0RWxlbSk7XG4gICAgfVxuXG4gICAgcHJldlRhYigpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHsgaXRlbXMgfSA9IHNlbGY7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRJdGVtID0gc2VsZi5jdXJyZW50SW5kZXg7XG4gICAgICAgIGNvbnN0IG51bWJlck9mRWxlbSA9IHNlbGYuaXRlbXMubGVuZ3RoO1xuICAgICAgICBsZXQgZm91bmRJbmRleCA9IDA7XG4gICAgICAgIGxldCBwcmV2RWxlbTtcblxuICAgICAgICBpdGVtcy5mb3JFYWNoKChpdGVtLCBpKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpdGVtSUQgPSBzZWxmLmdldE5hdlRhYklEKGl0ZW0pO1xuICAgICAgICAgICAgaWYgKGl0ZW1JRCA9PT0gY3VycmVudEl0ZW0pIHtcbiAgICAgICAgICAgICAgICBmb3VuZEluZGV4ID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKGZvdW5kSW5kZXggPiAwKSB7XG4gICAgICAgICAgICBzZWxmLmNoYW5nZUFjdGl2ZVRhYihmb3VuZEluZGV4IC0gMSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBmb3VuZEluZGV4ID09PSAwID8gcHJldkVsZW0gPSBudW1iZXJPZkVsZW0gLSAxIDogcHJldkVsZW0gPSBmb3VuZEluZGV4IC0gMTtcbiAgICAgICAgLy8gc2VsZi5jaGFuZ2VBY3RpdmVUYWIocHJldkVsZW0pO1xuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBEU01QVGFic0NsYXNzO1xuIiwiaW1wb3J0IERTTVBBY2NvcmRpb25zIGZyb20gJy4vRFNNUEFjY29yZGlvbnMnO1xuaW1wb3J0IERTTVBUYWJzVGFiIGZyb20gJy4vRFNNUFRhYnMtdGFiJztcbmltcG9ydCB7IHVfdGhyb3R0bGVkIH0gZnJvbSAnLi4vLi4vdXRpbHMvdXRpbHMnO1xuaW1wb3J0IHsgdV9wYXJzZUJvb2wgfSBmcm9tICcuLi8uLi91dGlscy91X3R5cGVzJztcblxuY2xhc3MgRFNNUFRhYlRvQWNjb3JkaW9uTW9iaWxlIHtcbiAgICBjb25zdHJ1Y3RvcihzZWxlY3Rvcikge1xuICAgICAgICB0aGlzLnRhYmFjY0lEID0gJyNqcy10YWItYWNjJztcbiAgICAgICAgdGhpcy50YWJhY2NTZWxlY3RvciA9ICcuanMtdGFicy10by1hY2Mtd3JhcHBlcic7XG4gICAgICAgIHRoaXMudGFiYWNjSXRlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMudGFiYWNjU2VsZWN0b3IpO1xuXG4gICAgICAgIHRoaXMudGFiT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHdyYXBwZXI6ICcuanMtdGFicy13cmFwcGVyJyxcbiAgICAgICAgICAgIHNlbGVjdG9yczoge1xuICAgICAgICAgICAgICAgIG5hdjogJy5qcy10YWJzLW5hdi1pdGVtJyxcbiAgICAgICAgICAgICAgICBwYW5lbDogJy5qcy10YWJzLXBhbmVsJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5hY2NvcmRpb25PcHRpb25zID0ge1xuICAgICAgICAgICAgc2VsZWN0b3JzOiB7XG4gICAgICAgICAgICAgICAgaXRlbTogJy5qcy10YWJzLXBhbmVsJyxcbiAgICAgICAgICAgICAgICB0cmlnZ2VyOiAnLmpzLXRhYnMtbGFiZWwnLFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICcuanMtdGEtY29udGVudCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3B0OiB7XG4gICAgICAgICAgICAgICAgY2xvc2U6IHRydWUsXG4gICAgICAgICAgICAgICAgZXhwYW5kOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBzY3JvbGxUb1ZpZXc6IGZhbHNlLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsYXNzZXM6IHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0aW9uOiB7XG4gICAgICAgICAgICAgICAgY29udGVudDogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5pc01vYmlsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmlzRGVza3RvcCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuYWNjb3JkaW9uSW5zdGFuY2UgPSBudWxsO1xuICAgICAgICB0aGlzLnRhYkluc3RhbmNlID0gbnVsbDtcblxuICAgICAgICBpZiAodHlwZW9mIHNlbGVjdG9yICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy50YWJhY2NJRCA9IHNlbGVjdG9yO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuXG4gICAgaW5pdCgpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBsZXQgY3VycmVudFdpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIGxldCBicmVha3BvaW50ID0gNzY4O1xuICAgICAgICBjdXJyZW50V2lkdGggPCBicmVha3BvaW50ID8gdGhpcy5pc01vYmlsZSA9IHRydWUgOiB0aGlzLmlzRGVza3RvcCA9IHRydWU7XG5cbiAgICAgICAgaWYgKHNlbGYuaXNNb2JpbGUpIHNlbGYuYnVpbGRBY2NvcmRpb24oKTtcbiAgICAgICAgaWYgKHNlbGYuaXNEZXNrdG9wKSBzZWxmLmJ1aWxkVGFiKCk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgICAgICAgIHNlbGYudGhyb3R0bGVTY3JvbGwoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy50aHJvdHRsZVNjcm9sbCA9IHVfdGhyb3R0bGVkKCgpID0+IHtcbiAgICAgICAgICAgIHNlbGYuYnVpbGRUYWJBY2NvcmRpb24oKTtcbiAgICAgICAgfSwgMTUwKTtcblxuICAgICAgICBzZWxmLmJ1aWxkVGFiQWNjb3JkaW9uKCk7XG4gICAgfVxuXG4gICAgYnVpbGRUYWJBY2NvcmRpb24oKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgbGV0IG5ld1dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgIGxldCBicmVha3BvaW50ID0gNzY4O1xuICAgICAgICBpZiAobmV3V2lkdGggPCBicmVha3BvaW50KSB7XG4gICAgICAgICAgICBpZiAoIXNlbGYuaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNlbGYudGFiSW5zdGFuY2UgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYudGFiSW5zdGFuY2UudW5iaW5kVGFiTmF2RXZlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi50YWJJbnN0YW5jZS51bmJpbmRUYWJQYW5lbEV2ZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYudGFiSW5zdGFuY2UgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNlbGYuYnVpbGRBY2NvcmRpb24oKTtcbiAgICAgICAgICAgICAgICBzZWxmLmlzRGVza3RvcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHNlbGYuaXNNb2JpbGUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFzZWxmLmlzRGVza3RvcCkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc2VsZi5hY2NvcmRpb25JbnN0YW5jZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NvcmRpb25JbnN0YW5jZS5hY2NvcmRpb25VbmJpbmRFdmVudHMoKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hY2NvcmRpb25JbnN0YW5jZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBzZWxmLmJ1aWxkVGFiKCk7XG4gICAgICAgICAgICAgICAgc2VsZi5pc01vYmlsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHNlbGYuaXNEZXNrdG9wID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJ1aWxkQWNjb3JkaW9uKCkge1xuICAgICAgICB0aGlzLnBhcnNlT3B0aW9ucyh0aGlzLnRhYmFjY0lEKTtcbiAgICAgICAgdGhpcy5hY2NvcmRpb25JbnN0YW5jZSA9IG5ldyBEU01QQWNjb3JkaW9ucyh0aGlzLnRhYmFjY0lELCB0aGlzLmFjY29yZGlvbk9wdGlvbnMpO1xuICAgIH1cblxuICAgIGJ1aWxkVGFiKCkge1xuICAgICAgICB0aGlzLnRhYk9wdGlvbnMud3JhcHBlciA9IHRoaXMudGFiYWNjSUQ7XG4gICAgICAgIHRoaXMudGFiSW5zdGFuY2UgPSBuZXcgRFNNUFRhYnNUYWIodGhpcy50YWJPcHRpb25zKTtcbiAgICAgICAgdGhpcy50YWJJbnN0YW5jZS5jaGFuZ2VBY3RpdmVUYWIoKTtcbiAgICB9XG5cbiAgICBwYXJzZU9wdGlvbnMoc2VsZWN0b3IpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgc2VsZi5hY2NvcmRpb25PcHRpb25zLm9wdC5zY3JvbGxUb1ZpZXcgPSB1X3BhcnNlQm9vbCh3cmFwcGVyLmdldEF0dHJpYnV0ZSgnZGF0YS1zY3JvbGwtdG8tdmlldycpKVxuICAgICAgICAgICAgfHwgc2VsZi5hY2NvcmRpb25PcHRpb25zLm9wdC5zY3JvbGxUb1ZpZXc7XG4gICAgICAgIHNlbGYuYWNjb3JkaW9uT3B0aW9ucy5jbGFzc2VzLmRpc3BsYXkgPSB3cmFwcGVyLmdldEF0dHJpYnV0ZSgnZGF0YS1hY2MtZGlzcGxheScpXG4gICAgICAgICAgICB8fCBzZWxmLmFjY29yZGlvbk9wdGlvbnMuY2xhc3Nlcy5kaXNwbGF5O1xuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBEU01QVGFiVG9BY2NvcmRpb25Nb2JpbGU7XG4iLCJpbXBvcnQgRFNNUFRhYnNUYWIgZnJvbSAnLi9EU01QVGFicy10YWInO1xuaW1wb3J0IHsgY2FsbFRhYkFjY29yZGlvbnNNb2JpbGUgfSBmcm9tICcuLi8uLi9mdW5jdGlvbi1jYWxscy90YWJzLXRvLWFjY29yZGlvbi1tb2JpbGUnO1xuXG5mdW5jdGlvbiBzZWxlY3RDb250aW5lbnQoKSB7XG4gICAgJCgnLmpzLWNvbnRpbmVudCcpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICQodGhpcykub24oJ2NsaWNrJywgKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSAkKHRoaXMpLmNsb3Nlc3QoJy5tLXRhYnMnKS5maW5kKCcuanMtdGFicy10by1hY2Mtd3JhcHBlcicpO1xuICAgICAgICAgICAgY29uc3QgbG9hZGVyID0gJCh0aGlzKS5wYXJlbnQoKS5maW5kKCcuanMtbG9hZGVyJyk7XG5cbiAgICAgICAgICAgICQodGhpcykucGFyZW50KCkuZmluZCgnLmpzLWNvbnRpbmVudCcpLnJlbW92ZUNsYXNzKCdpcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2lzLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICBjb25zdCBjb250aW5lbnRJRCA9IGUudGFyZ2V0LmRhdGFzZXQuY29udGluZW50SWQ7XG4gICAgICAgICAgICBjb25zdCBibG9ja0lEID0gZS50YXJnZXQuZGF0YXNldC5ibG9ja19pZDtcbiAgICAgICAgICAgIGNvbnN0IG5hdkxheW91dCA9IGUudGFyZ2V0LmRhdGFzZXQubmF2X2xheW91dDtcbiAgICAgICAgICAgIGNvbnN0IHsgbmF2TGF5b3V0Q2xhc3NOYW1lIH0gPSBlLnRhcmdldC5kYXRhc2V0O1xuICAgICAgICAgICAgY29uc3Qgc2hvd051bWJlcnMgPSBlLnRhcmdldC5kYXRhc2V0LnNob3dfbnVtYmVycztcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybU1vYmlsZSA9IGUudGFyZ2V0LmRhdGFzZXQudHJhbnNmb3JtbW9iO1xuICAgICAgICAgICAgbGV0IGxlZnRCb3R0b21JbWFnZSA9ICcnO1xuXG4gICAgICAgICAgICBpZiAoZS50YXJnZXQuZGF0YXNldC5sZWZ0Ym90dG9taW1hZ2UpIHtcbiAgICAgICAgICAgICAgICBsZWZ0Qm90dG9tSW1hZ2UgPSBqUXVlcnkucGFyc2VKU09OKGUudGFyZ2V0LmRhdGFzZXQubGVmdGJvdHRvbWltYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHsgbGF5b3V0IH0gPSBlLnRhcmdldC5kYXRhc2V0O1xuICAgICAgICAgICAgY29uc3QgdGFic1BhbmVsQ2xhc3NOYW1lID0gZS50YXJnZXQuZGF0YXNldC50YWJzcGFuZWxjbGFzc25hbWU7XG4gICAgICAgICAgICBjb25zdCBjb2x1bW5zT3JkZXIgPSBlLnRhcmdldC5kYXRhc2V0LmNvbHVtbnNvcmRlcjtcbiAgICAgICAgICAgIGxldCByaWdodFRvcEltYWdlID0gJyc7XG4gICAgICAgICAgICBpZiAoZS50YXJnZXQuZGF0YXNldC5yaWdodHRvcGltYWdlKSB7XG4gICAgICAgICAgICAgICAgcmlnaHRUb3BJbWFnZSA9IGpRdWVyeS5wYXJzZUpTT04oZS50YXJnZXQuZGF0YXNldC5yaWdodHRvcGltYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHBvc3RJbiA9IEpTT04ucGFyc2UoZS50YXJnZXQuZGF0YXNldC5wb3N0SW4gfHwgJ3t9Jyk7XG5cbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICAgICAgICBjb250aW5lbnROZXdDb250ZW50KHsgZWxlbWVudCwgbG9hZGVyLCBjb250aW5lbnRJRCwgYmxvY2tJRCwgbmF2TGF5b3V0LCBuYXZMYXlvdXRDbGFzc05hbWUsIHNob3dOdW1iZXJzLCB0cmFuc2Zvcm1Nb2JpbGUsIGxlZnRCb3R0b21JbWFnZSwgbGF5b3V0LCB0YWJzUGFuZWxDbGFzc05hbWUsIGNvbHVtbnNPcmRlciwgcmlnaHRUb3BJbWFnZSwgcG9zdEluIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gY29udGluZW50TmV3Q29udGVudCh7IGVsZW1lbnQsIGxvYWRlciwgY29udGluZW50SUQsIGJsb2NrSUQsIG5hdkxheW91dCwgbmF2TGF5b3V0Q2xhc3NOYW1lLCBzaG93TnVtYmVycywgdHJhbnNmb3JtTW9iaWxlLCBsZWZ0Qm90dG9tSW1hZ2UsIGxheW91dCwgdGFic1BhbmVsQ2xhc3NOYW1lLCBjb2x1bW5zT3JkZXIsIHJpZ2h0VG9wSW1hZ2UsIHBvc3RJbiB9KSB7XG4gICAgbG9hZGVyLmFkZENsYXNzKCctdmlzaWJsZScpO1xuICAgIGNvbnN0IGFqYXhEYXRhID0ge1xuICAgICAgICBhY3Rpb246ICdnZXRfbmV3X2NvdW50cmllcycsXG4gICAgICAgIGNvbnRpbmVudElELFxuICAgICAgICBibG9ja0lELFxuICAgICAgICBuYXZMYXlvdXQsXG4gICAgICAgIG5hdkxheW91dENsYXNzTmFtZSxcbiAgICAgICAgc2hvd051bWJlcnMsXG4gICAgICAgIHRyYW5zZm9ybU1vYmlsZSxcbiAgICAgICAgbGVmdEJvdHRvbUltYWdlLFxuICAgICAgICBsYXlvdXQsXG4gICAgICAgIHRhYnNQYW5lbENsYXNzTmFtZSxcbiAgICAgICAgY29sdW1uc09yZGVyLFxuICAgICAgICByaWdodFRvcEltYWdlLFxuICAgICAgICBwb3N0SW4sXG4gICAgfTtcbiAgICBqUXVlcnkuYWpheCh7XG4gICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgdXJsOiBkcy5hamF4X3VybCxcbiAgICAgICAgZGF0YTogYWpheERhdGEsXG4gICAgICAgIHN1Y2Nlc3MocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGxvYWRlci5yZW1vdmVDbGFzcygnLXZpc2libGUnKTtcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3Jlc3BvbnNlJywgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICQoZWxlbWVudCkuaHRtbChyZXNwb25zZS5kYXRhLmh0bWwpO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgZHJvcGRvd24gPSBuZXcgRFNNUFRhYnNUYWIoe1xuICAgICAgICAgICAgICAgICAgICB3cmFwcGVyOiBgIyR7ZWxlbWVudFswXS5nZXRBdHRyaWJ1dGUoJ2lkJyl9YCxcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3JzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuYXY6ICcuanMtdGFicy1uYXYtaXRlbScsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYW5lbDogJy5qcy10YWJzLXBhbmVsJyxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGRyb3Bkb3duLmluaXQoKTtcbiAgICAgICAgICAgICAgICBjYWxsVGFiQWNjb3JkaW9uc01vYmlsZSgpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2ZXJ0aWNhbFRhYnNDUFQoKSB7XG4gICAgc2VsZWN0Q29udGluZW50KCk7XG59XG4iLCIvKipcbiAqIGh0dHBzOi8vd3d3LmlsZWFybmphdmFzY3JpcHQuY29tL3BsYWluanMtZmFkZWluLWZhZGVvdXQvXG4gKlxuICogVE9ETzogdGhlcmUgYXJlIGJldHRlciBmYWRlSW4gZmFkZU91dCBzY3JpcHRzIHdpdGggYW5pbWF0aW9uIGVhc2luZ3NcbiAqL1xuXG4vLyBleHBvcnQgY29uc3QgZmFkZUluID0gKGVsLCBkaXNwbGF5U3R5bGUgPSAnYmxvY2snLCBzbW9vdGggPSB0cnVlKSA9PiB7XG4vLyAgICAgZWwuc3R5bGUub3BhY2l0eSA9IDA7XG4vLyAgICAgZWwuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXlTdHlsZTtcbi8vICAgICBpZiAoc21vb3RoKSB7XG4vLyAgICAgICAgIGxldCBvcGFjaXR5ID0gMDtcbi8vICAgICAgICAgbGV0IHJlcXVlc3Q7XG4vL1xuLy8gICAgICAgICBjb25zdCBhbmltYXRpb24gPSAoKSA9PiB7XG4vLyAgICAgICAgICAgICBlbC5zdHlsZS5vcGFjaXR5ID0gb3BhY2l0eSArPSAwLjA0O1xuLy8gICAgICAgICAgICAgaWYgKG9wYWNpdHkgPj0gMSkge1xuLy8gICAgICAgICAgICAgICAgIG9wYWNpdHkgPSAxO1xuLy8gICAgICAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJlcXVlc3QpO1xuLy8gICAgICAgICAgICAgfVxuLy8gICAgICAgICB9O1xuLy9cbi8vICAgICAgICAgY29uc3QgckFmID0gKCkgPT4ge1xuLy8gICAgICAgICAgICAgcmVxdWVzdCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShyQWYpO1xuLy8gICAgICAgICAgICAgYW5pbWF0aW9uKCk7XG4vLyAgICAgICAgIH07XG4vLyAgICAgICAgIHJBZigpO1xuLy9cbi8vICAgICB9IGVsc2Uge1xuLy8gICAgICAgICBlbC5zdHlsZS5vcGFjaXR5ID0gMTtcbi8vICAgICB9XG4vLyB9O1xuLy9cbi8vIGV4cG9ydCBjb25zdCBmYWRlT3V0ID0gKGVsLCBkaXNwbGF5U3R5bGUgPSAnbm9uZScsIHNtb290aCA9IHRydWUgKSA9PiB7XG4vLyAgICAgaWYgKHNtb290aCkge1xuLy8gICAgICAgICBsZXQgb3BhY2l0eSA9IGVsLnN0eWxlLm9wYWNpdHk7XG4vLyAgICAgICAgIGxldCByZXF1ZXN0O1xuLy9cbi8vICAgICAgICAgY29uc3QgYW5pbWF0aW9uID0gKCkgPT4ge1xuLy8gICAgICAgICAgICAgZWwuc3R5bGUub3BhY2l0eSA9IG9wYWNpdHkgLT0gMC4wNDtcbi8vICAgICAgICAgICAgIGlmIChvcGFjaXR5IDw9IDApIHtcbi8vICAgICAgICAgICAgICAgICBvcGFjaXR5ID0gMDtcbi8vICAgICAgICAgICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID0gZGlzcGxheVN0eWxlO1xuLy8gICAgICAgICAgICAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJlcXVlc3QpO1xuLy8gICAgICAgICAgICAgfVxuLy8gICAgICAgICB9O1xuLy9cbi8vICAgICAgICAgY29uc3QgckFmID0gKCkgPT4ge1xuLy8gICAgICAgICAgICAgcmVxdWVzdCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShyQWYpO1xuLy8gICAgICAgICAgICAgYW5pbWF0aW9uKCk7XG4vLyAgICAgICAgIH07XG4vLyAgICAgICAgIHJBZigpO1xuLy9cbi8vICAgICB9IGVsc2Uge1xuLy8gICAgICAgICBlbC5zdHlsZS5vcGFjaXR5ID0gMDtcbi8vICAgICB9XG4vLyB9O1xuY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgZHVyYXRpb246IDEwMCxcbiAgICBjb21wbGV0ZSgpIHtcblxuICAgIH1cbn07XG5cbmNvbnN0IGFuaW1hdGVGYWRlID0gKG9wdGlvbnMpID0+IHtcbiAgICBsZXQgc3RhcnQgPSBuZXcgRGF0ZTtcbiAgICBsZXQgaWQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcbiAgICAgICAgbGV0IHRpbWVQYXNzZWQgPSBuZXcgRGF0ZSAtIHN0YXJ0O1xuICAgICAgICBsZXQgcHJvZ3Jlc3MgPSB0aW1lUGFzc2VkIC8gb3B0aW9ucy5kdXJhdGlvbjtcbiAgICAgICAgaWYgKHByb2dyZXNzID4gMSkge1xuICAgICAgICAgICAgcHJvZ3Jlc3MgPSAxO1xuICAgICAgICB9XG4gICAgICAgIG9wdGlvbnMucHJvZ3Jlc3MgPSBwcm9ncmVzcztcbiAgICAgICAgbGV0IGRlbHRhID0gb3B0aW9ucy5kZWx0YShwcm9ncmVzcyk7XG4gICAgICAgIG9wdGlvbnMuc3RlcChkZWx0YSk7XG4gICAgICAgIGlmIChwcm9ncmVzcyA9PSAxKSB7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKGlkKTtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBvcHRpb25zLmNvbXBsZXRlID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwgb3B0aW9ucy5kZWxheSB8fCAxMCk7XG59XG5cbmV4cG9ydCBjb25zdCB1X2ZhZGVJbiA9IChlbGVtZW50LCBvcHRpb25zPSB7fSkgPT4ge1xuICAgIGlmKHR5cGVvZiBvcHRpb25zLmR1cmF0aW9uID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIG9wdGlvbnMuZHVyYXRpb24gPSBkZWZhdWx0cy5kdXJhdGlvbjtcbiAgICB9XG4gICAgbGV0IHRvID0gMDtcbiAgICBhbmltYXRlRmFkZSh7XG4gICAgICAgIGR1cmF0aW9uOiBvcHRpb25zLmR1cmF0aW9uLFxuICAgICAgICBkZWx0YShwcm9ncmVzcykge1xuICAgICAgICAgICAgcHJvZ3Jlc3MgPSB0aGlzLnByb2dyZXNzO1xuICAgICAgICAgICAgcmV0dXJuIGVhc2luZ3Muc3dpbmcocHJvZ3Jlc3MpO1xuICAgICAgICB9LFxuICAgICAgICBjb21wbGV0ZTogb3B0aW9ucy5jb21wbGV0ZSxcbiAgICAgICAgc3RlcChkZWx0YSkge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gdG8gKyBkZWx0YTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5leHBvcnQgY29uc3QgdV9mYWRlT3V0ID0gKGVsZW1lbnQsIG9wdGlvbnMgPSB7fSkgPT4ge1xuICAgIGlmKHR5cGVvZiBvcHRpb25zLmR1cmF0aW9uID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIG9wdGlvbnMuZHVyYXRpb24gPSBkZWZhdWx0cy5kdXJhdGlvbjtcbiAgICB9XG4gICAgbGV0IHRvID0gMTtcbiAgICBhbmltYXRlRmFkZSh7XG4gICAgICAgIGR1cmF0aW9uOiBvcHRpb25zLmR1cmF0aW9uLFxuICAgICAgICBkZWx0YShwcm9ncmVzcykge1xuICAgICAgICAgICAgcHJvZ3Jlc3MgPSB0aGlzLnByb2dyZXNzO1xuICAgICAgICAgICAgcmV0dXJuIGVhc2luZ3Muc3dpbmcocHJvZ3Jlc3MpO1xuICAgICAgICB9LFxuICAgICAgICBjb21wbGV0ZTogb3B0aW9ucy5jb21wbGV0ZSxcbiAgICAgICAgc3RlcChkZWx0YSkge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gdG8gLSBkZWx0YTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5jb25zdCBlYXNpbmdzID0ge1xuICAgIGxpbmVhcjogZnVuY3Rpb24ocHJvZ3Jlc3MpIHtcbiAgICAgICAgcmV0dXJuIHByb2dyZXNzO1xuICAgIH0sXG4gICAgcXVhZHJhdGljOiBmdW5jdGlvbihwcm9ncmVzcykge1xuICAgICAgICByZXR1cm4gTWF0aC5wb3cocHJvZ3Jlc3MsIDIpO1xuICAgIH0sXG4gICAgc3dpbmc6IGZ1bmN0aW9uKHByb2dyZXNzKSB7XG4gICAgICAgIHJldHVybiAwLjUgLSBNYXRoLmNvcyhwcm9ncmVzcyAqIE1hdGguUEkpIC8gMjtcbiAgICB9LFxuICAgIGNpcmM6IGZ1bmN0aW9uKHByb2dyZXNzKSB7XG4gICAgICAgIHJldHVybiAxIC0gTWF0aC5zaW4oTWF0aC5hY29zKHByb2dyZXNzKSk7XG4gICAgfSxcbiAgICBiYWNrOiBmdW5jdGlvbihwcm9ncmVzcywgeCkge1xuICAgICAgICByZXR1cm4gTWF0aC5wb3cocHJvZ3Jlc3MsIDIpICogKCh4ICsgMSkgKiBwcm9ncmVzcyAtIHgpO1xuICAgIH0sXG4gICAgYm91bmNlOiBmdW5jdGlvbihwcm9ncmVzcykge1xuICAgICAgICBmb3IgKHZhciBhID0gMCwgYiA9IDEsIHJlc3VsdDsgMTsgYSArPSBiLCBiIC89IDIpIHtcbiAgICAgICAgICAgIGlmIChwcm9ncmVzcyA+PSAoNyAtIDQgKiBhKSAvIDExKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC1NYXRoLnBvdygoMTEgLSA2ICogYSAtIDExICogcHJvZ3Jlc3MpIC8gNCwgMikgKyBNYXRoLnBvdyhiLCAyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgZWxhc3RpYzogZnVuY3Rpb24ocHJvZ3Jlc3MsIHgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucG93KDIsIDEwICogKHByb2dyZXNzIC0gMSkpICogTWF0aC5jb3MoMjAgKiBNYXRoLlBJICogeCAvIDMgKiBwcm9ncmVzcyk7XG4gICAgfVxufSIsImNvbnN0IGFkZE9ic2VydmVyID0gKGVsLCBwYXJhbXMpID0+IHtcbiAgICBpZiAoISgnSW50ZXJzZWN0aW9uT2JzZXJ2ZXInIGluIHdpbmRvdykpIHtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZChwYXJhbXMuY2xhc3NOYW1lKTtcbiAgICAgICAgaWYgKHBhcmFtcy5jYikge1xuICAgICAgICAgICAgcGFyYW1zLmNiKGVsKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoKGVudHJpZXMsIG9ic2VydmVyKSA9PiB7XG4gICAgICAgIGVudHJpZXMuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgICAgICAgIGlmIChlbnRyeS5pc0ludGVyc2VjdGluZykge1xuICAgICAgICAgICAgICAgIGVudHJ5LnRhcmdldC5jbGFzc0xpc3QuYWRkKHBhcmFtcy5jbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGAkeyBNYXRoLnJvdW5kKGVudHJ5LmludGVyc2VjdGlvblJhdGlvICogMTAwKSB9JWApO1xuICAgICAgICAgICAgICAgIGlmIChwYXJhbXMuY2IpIHtcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1zLmNiKGVudHJ5KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocGFyYW1zLnJlcGVhdCAhPT0gJ3RydWUnKSB7XG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLnVub2JzZXJ2ZShlbnRyeS50YXJnZXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAocGFyYW1zLnJlcGVhdCA9PT0gJ3RydWUnKSB7XG4gICAgICAgICAgICAgICAgZW50cnkudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUocGFyYW1zLmNsYXNzTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0sIHtcbiAgICAgICAgcm9vdDogbnVsbCxcbiAgICAgICAgcm9vdE1hcmdpbjogcGFyYW1zLm1hcmdpbixcbiAgICAgICAgdGhyZXNob2xkOiBwYXJhbXMudGhyZXNob2xkLFxuICAgIH0pO1xuICAgIG9ic2VydmVyLm9ic2VydmUoZWwpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgYWRkT2JzZXJ2ZXI7XG4iLCIvKipcbiAqIEVuYWJsZSBieSB0b2dnbGluZyBvcHRpb24gaW4gbW9kdWxlIEFEVkFOQ0VEIFNFVFRJTkdTL0VGRkVDVCBpbiB3cC1hZG1pbiBwYWdlLlxuICogTW9kdWxlIGhhcyB0aGUgZm9sbG93aW5nIG9wdGlvbnM6XG4gKlxuICogRU5BQkxFRCAoT04vT0ZGKTpcbiAqIFRyaWdnZXJzIEludGVyc2VjdGlvbk9ic2VydmVyIG9uIG1vZHVsZS5cbiAqIExpbms6IGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9JbnRlcnNlY3Rpb25PYnNlcnZlclxuICpcbiAqIFJFUEVBVEFCTEUgKE9OL09GRik6XG4gKiBDaGVjayBpZiB0aGUgYW5pbWF0aW9uIGlzIHJlcGVhdGVkIGVhY2ggdGltZSBtb2R1bGVzIGVudGVycyB2aWV3cG9ydC5cbiAqXG4gKiBFRkZFQ1QgKFNFTEVDVCBPUFRJT04pOlxuICogQ2hvb3NlcyBmcm9tIG9uZSBvZiBwcmVkZWZpbmVkIGFuaW1hdGlvbiBlZmZlY3RzLlxuICogWW91IGNhbiBhbHNvIGRvIGEgY3VzdG9tIENTUyBhbmltYXRpb24gYnkgYWRkaW5nIGN1c3RvbSBjbGFzcyBhbmQgYW5pbWF0aW9uIGl0IGluIENTUy5cbiAqXG4gKiBCYXNpYyBDU1MgYW5pbWF0aW9uczpcbiAqIExvY2F0aW9uOiB3cC1jb250ZW50L3RoZW1lcy9kaWdpdGFsZXhwcmVzcy9hc3NldHMvX3NyYy9zYXNzL3Zpc3VhbHMvYW5pbWF0ZS9fYS12aWV3cG9ydC5zY3NzXG4gKlxuICogQ3VzdG9tIENTUyBhbmltYXRpb25zOlxuICogTG9jYXRpb246IHdwLWNvbnRlbnQvdGhlbWVzL2RpZ2l0YWxleHByZXNzL2Fzc2V0cy9fc3JjL3Nhc3MvcHJvamVjdC1jdXN0b20vX2N1c3RvbV9fYW5pbWF0aW9ucy5zY3NzXG4gKlxuICogVEhSRVNIT0xEIChTVEVQUyBTTElERVIpOlxuICogU3BlY2lmaWVzICd0aHJlc2hvbGQnIG9mIHRoZSBlbGVtZW50OlxuICogTGluazogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0ludGVyc2VjdGlvbk9ic2VydmVyL3RocmVzaG9sZHNcbiAqXG4gKiBNQVJHSU4gKElOUFVUIEZJRUxEKTpcbiAqIFNwZWNpZmllcyAncm9vdE1hcmdpbicgb2YgdGhlIGVsZW1lbnQ6XG4gKiBMaW5rOiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvSW50ZXJzZWN0aW9uT2JzZXJ2ZXIvcm9vdE1hcmdpblxuICpcbiAqIEN1c3RvbSBvdmVycmlkZXMgY2FuIGJlIGFkZGVkLlxuICogQ2FsbGJhY2sgZnVuY3Rpb24gY2FuIGJlIHRyaWdnZXJlZCB3aGVuIGVsZW1lbnRzIGVudGVycyB2aWV3cG9ydC5cbiAqXG4gKiBFeGFtcGxlIHVzYWdlIG9uIGEgY3VzdG9tIGVsZW1lbnQ6XG4gKiBuZXcgRFNNUFZpZXdBbmltKHtcbiAqICAgICAgICAgc2VsZWN0b3I6ICcuY3VzdG9tLXNlbGVjdG9yJyxcbiAqICAgICAgICAgY2xhc3M6ICcuY3VzdG9tLWFuaW1hdGlvbi1jbGFzcycsXG4gKiAgICAgICAgIHJlcGVhdDogJ3RydWUnLFxuICogICAgICAgICB0aHJlc2hvbGQ6ICcwJyxcbiAqICAgICAgICAgbWFyZ2luOiAnMHB4IDBweCAtMTAlIDBweCcsXG4gKiAgICAgICAgIC8vIENhbGxiYWNrIGZ1bmN0aW9uIHdoZW4gZWxlbWVudCBpcyBpbnRlcnNlY3RpbmdcbiAqICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcbiAqICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjYWxsYmFjayBmdW5jdGlvbicpO1xuICogICAgICAgfSxcbiAqICB9KTtcbiAqL1xuXG5pbXBvcnQgeyB1X3Rocm90dGxlZCB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IGFkZE9ic2VydmVyIGZyb20gJy4vdV9pby1hbmltLW9ic2VydmVyJztcblxuY2xhc3MgRFNNUFZpZXdBbmltIHtcblxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5jb25maWcgPSB7XG4gICAgICAgICAgICBzZWxlY3RvcjogJ1tkYXRhLXZpZXdwb3J0PVwidHJ1ZVwiXScsXG4gICAgICAgICAgICByZXBlYXQ6ICdmYWxzZScsXG4gICAgICAgICAgICBjbGFzczogJ2luLXZpZXcnLFxuICAgICAgICAgICAgdGhyZXNob2xkOiAwLFxuICAgICAgICAgICAgbWFyZ2luOiAnMHB4IDBweCAwcHggMHB4JyxcbiAgICAgICAgICAgIGNhbGxiYWNrKCkge1xuXG4gICAgICAgICAgICB9LFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmNvbmZpZ09wdGlvbnMgPSB7IC4uLnRoaXMuY29uZmlnLCAuLi5vcHRpb25zIHx8IHt9IH07XG4gICAgICAgIHRoaXMudHJpZ2dlcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHRoaXMuY29uZmlnT3B0aW9ucy5zZWxlY3Rvcik7XG5cbiAgICAgICAgdGhpcy5pblZpZXdwb3J0KCk7XG4gICAgICAgIHRoaXMuaW9CaW5kRXZlbnRzKCk7XG4gICAgfVxuXG4gICAgaW5WaWV3cG9ydCgpIHtcbiAgICAgICAgdGhpcy50cmlnZ2Vycy5mb3JFYWNoKCh0cmlnZ2VyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBhdHRyID0ge1xuICAgICAgICAgICAgICAgIHJlcGVhdDogdHJpZ2dlci5kYXRhc2V0LnZpZXdwb3J0UmVwZWF0LFxuICAgICAgICAgICAgICAgIHRocmVzaG9sZDogdHJpZ2dlci5kYXRhc2V0LnZpZXdwb3J0VGhyZXNob2xkLFxuICAgICAgICAgICAgICAgIG1hcmdpbjogdHJpZ2dlci5kYXRhc2V0LnZpZXdwb3J0TWFyZ2luLFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgY29uc3Qge1xuICAgICAgICAgICAgICAgIGNsYXNzOiBjbGFzc05hbWUsXG4gICAgICAgICAgICAgICAgcmVwZWF0LFxuICAgICAgICAgICAgICAgIHRocmVzaG9sZCxcbiAgICAgICAgICAgICAgICBtYXJnaW4sXG4gICAgICAgICAgICAgICAgY2FsbGJhY2ssXG4gICAgICAgICAgICB9ID0gdGhpcy5jb25maWdPcHRpb25zO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCB7XG4gICAgICAgICAgICAgICAgcmVwZWF0OiBhdHRyUmVwZWF0LFxuICAgICAgICAgICAgICAgIHRocmVzaG9sZDogYXR0clRocmVzaG9sZCxcbiAgICAgICAgICAgICAgICBtYXJnaW46IGF0dHJNYXJnaW4sXG4gICAgICAgICAgICB9ID0gYXR0cjtcblxuICAgICAgICAgICAgYWRkT2JzZXJ2ZXIoXG4gICAgICAgICAgICAgICAgdHJpZ2dlcixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgcmVwZWF0OiBhdHRyUmVwZWF0IHx8IHJlcGVhdCxcbiAgICAgICAgICAgICAgICAgICAgdGhyZXNob2xkOiBhdHRyVGhyZXNob2xkIHx8IHRocmVzaG9sZCxcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiBhdHRyTWFyZ2luIHx8IG1hcmdpbixcbiAgICAgICAgICAgICAgICAgICAgY2I6IGNhbGxiYWNrLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpb0JpbmRFdmVudHMoKSB7XG4gICAgICAgIGNvbnN0IHRocm90dGxlSW5WaWV3ID0gdV90aHJvdHRsZWQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5pblZpZXdwb3J0KCk7XG4gICAgICAgIH0sIDMwKTtcblxuICAgICAgICAvLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aHJvdHRsZUluVmlldywgeyBwYXNzaXZlOiB0cnVlIH0pO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aHJvdHRsZUluVmlldywgeyBwYXNzaXZlOiB0cnVlIH0pO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIHRocm90dGxlSW5WaWV3LCB7IHBhc3NpdmU6IHRydWUgfSk7XG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IERTTVBWaWV3QW5pbTtcbiIsImltcG9ydCB7IHVfdGhyb3R0bGVkIH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuLyoqXG4gKiBzdGFuZGFsb25lIGZ1bmN0aW9uIHRoYXQgY2hlY2tzIHdoZXRoZXIgZGV2aWNlIGlzIHRvdWNoIG9yIG5vdFxuICogY2FsbCBpdCB3aXRoaW4gYW55dGhpbmcsXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn1cbiAqL1xuY29uc3QgdV9pc1RvdWNoRGV2aWNlID0gKCkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICAgICEhKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXG4gICAgICAgICAgICAoJ29udG91Y2hzdGFydCcgaW4gd2luZG93IHx8XG4gICAgICAgICAgICAgICAgKHdpbmRvdy5Eb2N1bWVudFRvdWNoICYmXG4gICAgICAgICAgICAgICAgICAgIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQgaW5zdGFuY2VvZiB3aW5kb3cuRG9jdW1lbnRUb3VjaCkpKSB8fFxuICAgICAgICAhISh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgICAgICAgKG5hdmlnYXRvci5tYXhUb3VjaFBvaW50cyB8fCBuYXZpZ2F0b3IubXNNYXhUb3VjaFBvaW50cykpXG4gICAgKTtcbn1cblxuLyoqXG4gKiBmdW5jdGlvbiB0aGF0IGNhbGxzIGlzVG91Y2hEZXZpY2UgZnVuY3Rpb24sXG4gKi9cbmNvbnN0IGlzVG91Y2hIdG1sVXRpbCA9ICgpID0+IHtcbiAgICBsZXQgdG91Y2ggPSB1X2lzVG91Y2hEZXZpY2UoKTtcbiAgICBsZXQgaHRtbCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnaHRtbCcgKVswXTtcblxuICAgIC8vIGlmIHRydWUsIGFkZCB0b3VjaC1kZXZpY2UgdG8gaHRtbCwgb3RoZXJ3aXNlIG5vLXRvdWNoLWRldmljZVxuICAgIGlmICh0b3VjaCkge1xuICAgICAgICBodG1sLmNsYXNzTGlzdC5yZW1vdmUoJ25vLXRvdWNoLWRldmljZScpO1xuICAgICAgICBodG1sLmNsYXNzTGlzdC5hZGQoJ3RvdWNoLWRldmljZScpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaHRtbC5jbGFzc0xpc3QucmVtb3ZlKCd0b3VjaC1kZXZpY2UnKTtcbiAgICAgICAgaHRtbC5jbGFzc0xpc3QuYWRkKCduby10b3VjaC1kZXZpY2UnKTtcbiAgICB9XG59XG5cbi8qKlxuICogZXhwb3J0ZWQgZnVuY3Rpb24gYWRkVG91Y2hUb0h0bWxVdGlsXG4gKiBpbXBvcnRlZCBpbnRvIGluZGV4LmpzIGFuZCBjYWxsZWQgd2hlbiBET01SZWFkeSxcbiAqIGNvbnRhaW5zICdyZXNpemUnIGV2ZW50IGxpc3RlbmVyIHRvIGNoZWNrIGZvclxuICogZGV2aWNlIG9yaWVudGF0aW9uLCBvciBjaGFuZ2VzXG4gKiBpcyB0aHJvdHRsZWQsIHRvIHByZXZlbnQgY29udGludW91c2x5IHRyaWdnZXJpbmdcbiAqIChtaW4gMzAwbXMgc28gY2hyb21lIGRldiB0b29sIGNhbiBjYXRjaCBpdClcbiAqL1xuY29uc3QgdV9hZGRUb3VjaFRvSHRtbCA9ICgpID0+IHtcbiAgICBpc1RvdWNoSHRtbFV0aWwoKTtcblxuICAgIC8vIHRocm90dGxlIHRoZSBmdW5jdGlvblxuICAgIGNvbnN0IHRocm90dGxlSXNUb3VjaCA9IHVfdGhyb3R0bGVkKCgpID0+IHtcbiAgICAgICAgaXNUb3VjaEh0bWxVdGlsKCk7XG4gICAgfSwgMzAwKTtcblxuICAgIC8vIGJpbmQgcmVzaXplIGV2ZW50XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcbiAgICAgICAgdGhyb3R0bGVJc1RvdWNoKCk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCB7XG4gICAgdV9pc1RvdWNoRGV2aWNlLFxuICAgIHVfYWRkVG91Y2hUb0h0bWxcbn07XG5cbiIsImNvbnN0IHVfZXh0ZW5kT2JqZWN0ID0gKGRlc3RpbmF0aW9uLCBzb3VyY2UpID0+IHtcbiAgICBmb3IgKGxldCBwcm9wZXJ0eSBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKHNvdXJjZVtwcm9wZXJ0eV0gJiYgc291cmNlW3Byb3BlcnR5XS5jb25zdHJ1Y3RvciAmJlxuICAgICAgICAgICAgc291cmNlW3Byb3BlcnR5XS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB7XG4gICAgICAgICAgICBkZXN0aW5hdGlvbltwcm9wZXJ0eV0gPSBkZXN0aW5hdGlvbltwcm9wZXJ0eV0gfHwge307XG4gICAgICAgICAgICB1X2V4dGVuZE9iamVjdChkZXN0aW5hdGlvbltwcm9wZXJ0eV0sIHNvdXJjZVtwcm9wZXJ0eV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVzdGluYXRpb25bcHJvcGVydHldID0gc291cmNlW3Byb3BlcnR5XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGVzdGluYXRpb247XG59O1xuXG5jb25zdCB1X2V4dGVuZCA9IChkZWZhdWx0cywgb3B0aW9ucykgPT4ge1xuICAgIGNvbnN0IGV4dGVuZGVkT3B0aW9ucyA9IHt9O1xuICAgIGZvciAobGV0IGtleSBpbiBkZWZhdWx0cykge1xuICAgICAgICBleHRlbmRlZE9wdGlvbnNba2V5XSA9IG9wdGlvbnNba2V5XSB8fCBkZWZhdWx0c1trZXldO1xuICAgIH1cbiAgICByZXR1cm4gZXh0ZW5kZWRPcHRpb25zO1xufTtcblxuY29uc3QgdV9tZXJnZURlZXAgPSAodGFyZ2V0LCBzb3VyY2UpID0+IHtcbiAgICBjb25zdCBpc09iamVjdCA9IChvYmopID0+IG9iaiAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JztcblxuICAgIGlmICghaXNPYmplY3QodGFyZ2V0KSB8fCAhaXNPYmplY3Qoc291cmNlKSkge1xuICAgICAgICByZXR1cm4gc291cmNlO1xuICAgIH1cblxuICAgIE9iamVjdC5rZXlzKHNvdXJjZSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICBjb25zdCB0YXJnZXRWYWx1ZSA9IHRhcmdldFtrZXldO1xuICAgICAgICBjb25zdCBzb3VyY2VWYWx1ZSA9IHNvdXJjZVtrZXldO1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldFZhbHVlKSAmJiBBcnJheS5pc0FycmF5KHNvdXJjZVZhbHVlKSkge1xuICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSB0YXJnZXRWYWx1ZS5jb25jYXQoc291cmNlVmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KHRhcmdldFZhbHVlKSAmJiBpc09iamVjdChzb3VyY2VWYWx1ZSkpIHtcbiAgICAgICAgICAgIHRhcmdldFtrZXldID0gdV9tZXJnZURlZXAoT2JqZWN0LmFzc2lnbih7fSwgdGFyZ2V0VmFsdWUpLCBzb3VyY2VWYWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVZhbHVlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xufVxuXG5leHBvcnQge1xuICAgIHVfZXh0ZW5kLFxuICAgIHVfZXh0ZW5kT2JqZWN0LFxuICAgIHVfbWVyZ2VEZWVwXG59OyIsIi8qKlxuICogVmlzaWJpbGl0eSBmdW5jdGlvbnNcbiAqL1xuXG5jb25zdCB1X3Nob3dEaXNwbGF5ID0gKGVsZW0pID0+IHtcbiAgICBlbGVtLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG59XG5cbmNvbnN0IHVfaGlkZURpc3BsYXkgPSAoZWxlbSkgPT4ge1xuICAgIGVsZW0uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xufVxuXG5jb25zdCB1X3Nob3dFbGVtID0gKGVsZW0sIGhpZGRlbiA9ICdpcy1oaWRkZW4nLCB2aXNpYmxlID0gJ2lzLXNob3duJykgPT4ge1xuICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShoaWRkZW4pO1xuICAgIGVsZW0uY2xhc3NMaXN0LmFkZCh2aXNpYmxlKTtcbn1cblxuY29uc3QgdV9oaWRlRWxlbSA9IChlbGVtLCBoaWRkZW4gPSAnaXMtaGlkZGVuJywgdmlzaWJsZSA9ICdpcy1zaG93bicpID0+IHtcbiAgICBlbGVtLmNsYXNzTGlzdC5hZGQoaGlkZGVuKTtcbiAgICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUodmlzaWJsZSk7XG59XG5cbmNvbnN0IHVfdG9nZ2xlRWxlbSA9IChlbGVtLCBoaWRkZW4gPSAnaXMtaGlkZGVuJykgPT4ge1xuICAgIGVsZW0uY2xhc3NMaXN0LnRvZ2dsZShoaWRkZW4pO1xufVxuXG5leHBvcnQge1xuICAgIHVfc2hvd0VsZW0sXG4gICAgdV9oaWRlRWxlbSxcbiAgICB1X3RvZ2dsZUVsZW0sXG4gICAgdV9zaG93RGlzcGxheSxcbiAgICB1X2hpZGVEaXNwbGF5XG59IiwiLyoqXG4gKiBodHRwczovL2dpdGh1Yi5jb20vamFucmVtYm9sZC9lczYtc2xpZGUtdXAtZG93blxuICpcbiAqIHVzYWdlIHdpdGggZWFzaW5nc1xuICpcbiAqL1xuXG5pbXBvcnQgeyB1X2V4dGVuZCB9IGZyb20gXCIuL3Vfb2JqZWN0X2V4dGVuZFwiO1xuaW1wb3J0IHsgdV9pc0ludGVnZXIgfSBmcm9tIFwiLi91X3R5cGVzXCI7XG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICAgIGR1cmF0aW9uOiAyNTAsXG4gICAgZWFzaW5nOiAoY3VycmVudFRpbWUsIHN0YXJ0VmFsdWUsIGRpZmZWYWx1ZSwgZHVyZWF0aW9uKSA9PiB7XG4gICAgICAgIHJldHVybiAtZGlmZlZhbHVlICogKGN1cnJlbnRUaW1lIC89IGR1cmVhdGlvbikgKiAoY3VycmVudFRpbWUgLSAyKSArIHN0YXJ0VmFsdWU7XG4gICAgfSxcbiAgICBkaXNwbGF5OiAnYmxvY2snXG59O1xuY29uc3QgZGlyZWN0aW9ucyA9IHtcbiAgICBPUEVOOiAxLFxuICAgIENMT1NFOiAyXG59O1xuZXhwb3J0IGNvbnN0IHVfc2xpZGVVcCA9IChlbGVtZW50LCBhcmdzID0ge30pID0+IHtcbiAgICBpZiAodV9pc0ludGVnZXIoYXJncykpIHtcbiAgICAgICAgYXJncyA9IHsgZHVyYXRpb246IGFyZ3MgfTtcbiAgICB9XG4gICAgY29uc3Qgb3B0aW9ucyA9IHVfZXh0ZW5kKGRlZmF1bHRzLCBhcmdzKTtcbiAgICBsZXQgZGlzcGxheVR5cGUgPSBvcHRpb25zLmRpc3BsYXk7XG4gICAgb3B0aW9ucy5kaXJlY3Rpb24gPSBkaXJlY3Rpb25zLkNMT1NFO1xuICAgIG9wdGlvbnMudG8gPSAwO1xuICAgIG9wdGlvbnMuc3RhcnRpbmdIZWlnaHQgPSBlbGVtZW50LnNjcm9sbEhlaWdodDtcbiAgICBvcHRpb25zLmRpc3RhbmNlSGVpZ2h0ID0gLW9wdGlvbnMuc3RhcnRpbmdIZWlnaHQ7XG4gICAgc2V0RWxlbWVudEFuaW1hdGlvblN0eWxlcyhlbGVtZW50LCBkaXNwbGF5VHlwZSk7XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgodGltZXN0YW1wKSA9PiBhbmltYXRlKGVsZW1lbnQsIG9wdGlvbnMsIHRpbWVzdGFtcCkpO1xufTtcbmV4cG9ydCBjb25zdCB1X3NsaWRlRG93biA9IChlbGVtZW50LCBhcmdzID0ge30pID0+IHtcbiAgICBpZiAodV9pc0ludGVnZXIoYXJncykpIHtcbiAgICAgICAgYXJncyA9IHsgZHVyYXRpb246IGFyZ3MgfTtcbiAgICB9XG4gICAgZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnMHB4JztcbiAgICBjb25zdCBvcHRpb25zID0gdV9leHRlbmQoZGVmYXVsdHMsIGFyZ3MpO1xuICAgIGxldCBkaXNwbGF5VHlwZSA9IG9wdGlvbnMuZGlzcGxheTtcbiAgICBzZXRFbGVtZW50QW5pbWF0aW9uU3R5bGVzKGVsZW1lbnQsIGRpc3BsYXlUeXBlKTtcbiAgICBvcHRpb25zLmRpcmVjdGlvbiA9IGRpcmVjdGlvbnMuT1BFTjtcbiAgICBvcHRpb25zLnRvID0gZWxlbWVudC5zY3JvbGxIZWlnaHQ7XG4gICAgb3B0aW9ucy5zdGFydGluZ0hlaWdodCA9IDA7XG4gICAgb3B0aW9ucy5kaXN0YW5jZUhlaWdodCA9IG9wdGlvbnMudG87XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgodGltZXN0YW1wKSA9PiBhbmltYXRlKGVsZW1lbnQsIG9wdGlvbnMsIHRpbWVzdGFtcCkpO1xufTtcbmNvbnN0IGFuaW1hdGUgPSAoZWxlbWVudCwgb3B0aW9ucywgbm93KSA9PiB7XG4gICAgaWYgKCFvcHRpb25zLnN0YXJ0VGltZSkge1xuICAgICAgICBvcHRpb25zLnN0YXJ0VGltZSA9IG5vdztcbiAgICB9XG4gICAgY29uc3QgY3VycmVudFRpbWUgPSBub3cgLSBvcHRpb25zLnN0YXJ0VGltZTtcbiAgICBsZXQgYW5pbWF0aW9uQ29udGludWUgPSBjdXJyZW50VGltZSA8IG9wdGlvbnMuZHVyYXRpb247XG4gICAgbGV0IG5ld0hlaWdodCA9IG9wdGlvbnMuZWFzaW5nKGN1cnJlbnRUaW1lLCBvcHRpb25zLnN0YXJ0aW5nSGVpZ2h0LCBvcHRpb25zLmRpc3RhbmNlSGVpZ2h0LCBvcHRpb25zLmR1cmF0aW9uKTtcbiAgICBpZiAoYW5pbWF0aW9uQ29udGludWUpIHtcbiAgICAgICAgZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHtuZXdIZWlnaHQudG9GaXhlZCgyKX1weGA7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKHRpbWVzdGFtcCkgPT4gYW5pbWF0ZShlbGVtZW50LCBvcHRpb25zLCB0aW1lc3RhbXApKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChvcHRpb25zLmRpcmVjdGlvbiA9PT0gZGlyZWN0aW9ucy5DTE9TRSkge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmRpcmVjdGlvbiA9PT0gZGlyZWN0aW9ucy5PUEVOKSB7XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBvcHRpb25zLmRpc3BsYXkgPT09ICdmbGV4JyA/ICdmbGV4JyA6ICdibG9jayc7XG4gICAgICAgIH1cbiAgICAgICAgcmVtb3ZlRWxlbWVudEFuaW1hdGlvblN0eWxlcyhlbGVtZW50KTtcbiAgICB9XG59O1xuY29uc3Qgc2V0RWxlbWVudEFuaW1hdGlvblN0eWxlcyA9IChlbGVtZW50LCBkaXNwbGF5VHlwZSA9ICdibG9jaycpID0+IHtcbiAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBkaXNwbGF5VHlwZSA9PT0gJ2ZsZXgnID8gJ2ZsZXgnIDogJ2Jsb2NrJztcbiAgICBlbGVtZW50LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG4gICAgZWxlbWVudC5zdHlsZS5tYXJnaW5Ub3AgPSAnMCc7XG4gICAgZWxlbWVudC5zdHlsZS5tYXJnaW5Cb3R0b20gPSAnMCc7XG4gICAgZWxlbWVudC5zdHlsZS5wYWRkaW5nVG9wID0gJzAnO1xuICAgIGVsZW1lbnQuc3R5bGUucGFkZGluZ0JvdHRvbSA9ICcwJztcbn07XG5jb25zdCByZW1vdmVFbGVtZW50QW5pbWF0aW9uU3R5bGVzID0gKGVsZW1lbnQpID0+IHtcbiAgICBlbGVtZW50LnN0eWxlLmhlaWdodCA9IG51bGw7XG4gICAgZWxlbWVudC5zdHlsZS5vdmVyZmxvdyA9IG51bGw7XG4gICAgZWxlbWVudC5zdHlsZS5tYXJnaW5Ub3AgPSBudWxsO1xuICAgIGVsZW1lbnQuc3R5bGUubWFyZ2luQm90dG9tID0gbnVsbDtcbiAgICBlbGVtZW50LnN0eWxlLnBhZGRpbmdUb3AgPSBudWxsO1xuICAgIGVsZW1lbnQuc3R5bGUucGFkZGluZ0JvdHRvbSA9IG51bGw7XG59O1xuXG5leHBvcnQgY29uc3QgdV9zbGlkZVRvZ2dsZSA9IChlbGVtZW50LCBhcmdzID0ge30pID0+IHtcbiAgICBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuZGlzcGxheSA9PT0gJ25vbmUnKSB7XG4gICAgICAgIHJldHVybiB1X3NsaWRlRG93bihlbGVtZW50LCBhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdV9zbGlkZVVwKGVsZW1lbnQsIGFyZ3MpO1xuICAgIH1cbn0iLCJjb25zdCB1X2lzSW50ZWdlciA9ICh2YWx1ZSkgPT4ge1xuICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKSB7XG4gICAgICAgIHJldHVybiBOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIGlzRmluaXRlKHZhbHVlKSAmJiBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWU7XG4gICAgfVxufTtcblxuY29uc3QgdV9pc09iamVjdCA9IChvKSA9PiB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgdHlwZW9mIG8gPT09ICdvYmplY3QnICYmXG4gICAgICAgIG8gIT09IG51bGwgJiZcbiAgICAgICAgby5jb25zdHJ1Y3RvciAmJlxuICAgICAgICBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpID09PSAnT2JqZWN0J1xuICAgICk7XG59XG5cbmNvbnN0IHVfcGFyc2VCb29sID0gKHN0cikgPT4gIHtcbiAgICAvLyBjb25zb2xlLmxvZyh0eXBlb2Ygc3RyKTtcbiAgICAvLyBzdHJpY3Q6IEpTT04ucGFyc2Uoc3RyKVxuXG4gICAgaWYoc3RyID09IG51bGwpXG4gICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgIGlmICh0eXBlb2Ygc3RyID09PSAnYm9vbGVhbicpXG4gICAge1xuICAgICAgICByZXR1cm4gKHN0ciA9PT0gdHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYodHlwZW9mIHN0ciA9PT0gJ3N0cmluZycpXG4gICAge1xuICAgICAgICBpZihzdHIgPT0gXCJcIilcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xuICAgICAgICBpZihzdHIudG9Mb3dlckNhc2UoKSA9PSAndHJ1ZScgfHwgc3RyLnRvTG93ZXJDYXNlKCkgPT0gJ3llcycpXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcblxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvLC9nLCAnLicpO1xuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZSgvXlxccypcXC1cXHMqL2csICctJyk7XG4gICAgfVxuXG4gICAgLy8gdmFyIGlzTnVtID0gc3RyaW5nLm1hdGNoKC9eWzAtOV0rJC8pICE9IG51bGw7XG4gICAgLy8gdmFyIGlzTnVtID0gL15cXGQrJC8udGVzdChzdHIpO1xuICAgIGlmKCFpc05hTihzdHIpKVxuICAgICAgICByZXR1cm4gKHBhcnNlRmxvYXQoc3RyKSAhPSAwKTtcblxuICAgIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IHtcbiAgICB1X2lzSW50ZWdlcixcbiAgICB1X2lzT2JqZWN0LFxuICAgIHVfcGFyc2VCb29sXG59IiwiXG5jb25zdCB1X2RlYm91bmNlZCA9IChmdW5jLCBkZWxheSwgaW1tZWRpYXRlKSA9PiB7XG4gICAgbGV0IHRpbWVySWQ7XG4gICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgIGNvbnN0IGJvdW5kRnVuYyA9IGZ1bmMuYmluZCh0aGlzLCAuLi5hcmdzKTtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVySWQpO1xuICAgICAgICBpZiAoaW1tZWRpYXRlICYmICF0aW1lcklkKSB7XG4gICAgICAgICAgICBib3VuZEZ1bmMoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBjYWxsZWVGdW5jID0gaW1tZWRpYXRlID8gKCkgPT4geyB0aW1lcklkID0gbnVsbCB9IDogYm91bmRGdW5jO1xuICAgICAgICB0aW1lcklkID0gc2V0VGltZW91dChjYWxsZWVGdW5jLCBkZWxheSk7XG4gICAgfVxufVxuXG5jb25zdCB1X3Rocm90dGxlZCA9IChmdW5jLCBkZWxheSwgaW1tZWRpYXRlKSA9PiB7XG4gICAgbGV0IHRpbWVySWQ7XG4gICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgIGNvbnN0IGJvdW5kRnVuYyA9IGZ1bmMuYmluZCh0aGlzLCAuLi5hcmdzKTtcbiAgICAgICAgaWYgKHRpbWVySWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaW1tZWRpYXRlICYmICF0aW1lcklkKSB7XG4gICAgICAgICAgICBib3VuZEZ1bmMoKTtcbiAgICAgICAgfVxuICAgICAgICB0aW1lcklkID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBpZighaW1tZWRpYXRlKSB7XG4gICAgICAgICAgICAgICAgYm91bmRGdW5jKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aW1lcklkID0gbnVsbDtcbiAgICAgICAgfSwgZGVsYXkpO1xuICAgIH1cbn1cblxuZXhwb3J0IHtcbiAgICB1X2RlYm91bmNlZCxcbiAgICB1X3Rocm90dGxlZFxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGpRdWVyeTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgZGVmaW5pdGlvbikge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmosIHByb3ApIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApOyB9IiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvKlxuICogQHRpdGxlIE1haW4gQXBwXG4gKiBAZGVzY3JpcHRpb24gQXBwbGljYXRpb24gZW50cnkgcG9pbnRcbiAqL1xuXG4vLyBVdGlsc1xuaW1wb3J0IHsgdV9hZGRUb3VjaFRvSHRtbCB9IGZyb20gJy4vdXRpbHMvdV9pcy10b3VjaC1kZXZpY2UnO1xuLy8gaW1wb3J0IHsgdV9zY3JvbGxFZmZlY3QgfSBmcm9tICcuL3V0aWxzL3Vfc2Nyb2xsLWVmZmVjdCc7XG5pbXBvcnQgRFNNUFZpZXdBbmltIGZyb20gJy4vdXRpbHMvdV9pby1hbmltJztcblxuLy8gSGVhZGVyXG5pbXBvcnQgeyBkc19oZWFkZXJTdGlja3kgfSBmcm9tICcuL2hlYWRlci9kc19oZWFkZXJTdGlja3knO1xuaW1wb3J0IHsgZHNfaGVhZGVyU2VhcmNoIH0gZnJvbSAnLi9oZWFkZXIvZHNfaGVhZGVyU2VhcmNoJztcbmltcG9ydCB7IGRzX2hlYWRlck1lbnVUb2dnbGUgfSBmcm9tICcuL2hlYWRlci9kc19oZWFkZXJNZW51VG9nZ2xlJztcbmltcG9ydCB7IGRzX2hlYWRlck1lbnVTdWJNZW51VG9nZ2xlIH0gZnJvbSAnLi9oZWFkZXIvZHNfbWVudVN1Yk1lbnVUb2dnbGUnO1xuaW1wb3J0IHsgZHNfaGVhZGVyTW9iaWxlU3dpcGVVcCB9IGZyb20gJy4vaGVhZGVyL2RzX2hlYWRlck1vYmlsZVN3aXBlVXAnO1xuaW1wb3J0IHsgZHNfcHVtYUdsb2JhbCB9IGZyb20gJy4vaGVhZGVyL2RzX3B1bWFfZ2xvYmFsJztcblxuLy8gaW1wb3J0IHsgZHNfaGVhZGVySGVpZ2h0IH0gZnJvbSBcIi4vaGVhZGVyL2RzX2hlYWRlckhlaWdodFwiO1xuXG4vLyBGdW5jdGlvbiBDYWxsc1xuaW1wb3J0IHsgY2FsbFNsaWRlcnMgfSBmcm9tICcuL2Z1bmN0aW9uLWNhbGxzL3NsaWRlcnMnO1xuaW1wb3J0IHsgY2FsbEFjY29yZGlvbnMgfSBmcm9tICcuL2Z1bmN0aW9uLWNhbGxzL2FjY29yZGlvbnMnO1xuaW1wb3J0IHsgY2FsbFRhYkFjY29yZGlvbnNNb2JpbGUgfSBmcm9tICcuL2Z1bmN0aW9uLWNhbGxzL3RhYnMtdG8tYWNjb3JkaW9uLW1vYmlsZSc7XG5pbXBvcnQgeyBjYWxsSW1hZ2VTcGlubmVycyB9IGZyb20gJy4vZnVuY3Rpb24tY2FsbHMvM2QtbWVkaWEvaW1hZ2Utc3Bpbm5lcic7XG5cbmltcG9ydCB7IGRzX2NvbGxhcHNlIH0gZnJvbSAnLi9saWJyYXJ5L2NvbGxhcHNlcnMvZHNfY29sbGFwc2UnO1xuaW1wb3J0IHsgZHNfdG9nZ2xlRWxlbWVudCB9IGZyb20gJy4vbGlicmFyeS9jb2xsYXBzZXJzL2RzX3RvZ2dsZUVsZW1lbnQnO1xuaW1wb3J0IHsgZHNfcmVhZE1vcmUgfSBmcm9tICcuL2Z1bmN0aW9uLWNhbGxzL3RpbnltY2UtcmVhZC1tb3JlL2RzX3JlYWRNb3JlJztcbmltcG9ydCB7IGRzX2dyaWRkZXJJbml0IH0gZnJvbSAnLi9saWJyYXJ5L2NvbGxhcHNlcnMvZHNfZ3JpZGRlckluaXQnO1xuaW1wb3J0IHsgZHNfbG9hZE1vcmVCbG9nIH0gZnJvbSAnLi9ibG9nL2RzX2Jsb2ctZmlsdGVyJztcblxuLy8gTGlicmFyaWVzXG5pbXBvcnQgRFNNUE1lZGlhQ29udHJvbHMgZnJvbSAnLi9saWJyYXJ5L21lZGlhLWNvbnRyb2xzL21lZGlhLWNvbnRyb2wnO1xuaW1wb3J0IERTTVBUYWJzVGFiIGZyb20gJy4vbGlicmFyeS90YWJzLWFjY29yZGlvbnMvRFNNUFRhYnMtdGFiJztcbmltcG9ydCBEU01QVGFic0Ryb3Bkb3duIGZyb20gJy4vbGlicmFyeS90YWJzLWFjY29yZGlvbnMvRFNNUFRhYnMtZHJvcGRvd24nO1xuaW1wb3J0IERTTVBUYWJzVGFiRHJvcGRvd24gZnJvbSAnLi9saWJyYXJ5L3RhYnMtYWNjb3JkaW9ucy9EU01QVGFicy10YWJkcm9wZG93bic7XG5pbXBvcnQgeyB2ZXJ0aWNhbFRhYnNDUFQgfSBmcm9tICcuL2xpYnJhcnkvdGFicy1hY2NvcmRpb25zL0RTTVBWZXJ0aWNhbFRhYnNDUFQnO1xuaW1wb3J0IHsgZHNfcmV0YWlsTHVicmljYW50c0ZpbHRlcnMgfSBmcm9tICcuL2xpYnJhcnkvdGFicy1hY2NvcmRpb25zL0RTTVBSZXRhaWwtbHVicmljYW50cyc7XG5pbXBvcnQgeyBkc19sdWJyaWNhbnRzX2ZpbHRlcnMgfSBmcm9tICcuL2xpYnJhcnkvbHVicmljYW50cy9kc19maWx0ZXJfbHVicmljYW50cyc7XG5pbXBvcnQgeyBkc19vcGVuaW5nc19maWx0ZXJzIH0gZnJvbSAnLi9saWJyYXJ5L29wZW5pbmdzL2RzX2ZpbHRlcl9vcGVuaW5ncyc7XG5pbXBvcnQgeyBkc19yZXNvdXJjZXNfZGF0YSB9IGZyb20gXCIuL2xpYnJhcnkvcmVzb3VyY2VzL2RzX3Jlc291cmNlc1wiO1xuXG4vLyBDb21wb25lbnRzXG5pbXBvcnQgUHVyZUNvdW50ZXIgZnJvbSAnLi9saWJyYXJ5L2NvdW50ZXJzL3B1cmVjb3VudGVyJztcbmltcG9ydCBQcm9ncmVzc0NpcmNsZUNvdW50ZXIgZnJvbSAnLi9saWJyYXJ5L2NvdW50ZXJzL3Byb2dyZXNzLWNvdW50ZXInO1xuaW1wb3J0IHsgY29ycmVjdENsaXBQYXRoIH0gZnJvbSAnLi9jb21wb25lbnRzL2NvcnJlY3RDbGlwUGF0aCc7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gICAgLy8gQ2hlY2sgd2hldGhlciBpdCBpcyB0b3VjaCBkZXZpY2Ugb3Igbm90XG4gICAgdV9hZGRUb3VjaFRvSHRtbCgpO1xuICAgIC8vIHVfc2Nyb2xsRWZmZWN0KClcblxuICAgIC8qKlxuICAgICAqIEhlYWRlclxuICAgICAqL1xuICAgIC8vIFN0aWNreSBoZWFkZXJcbiAgICBkc19oZWFkZXJTdGlja3koJy5zaXRlLWhlYWRlcicsICdpcy1zdGlja3knKTtcbiAgICAvLyBkc19oZWFkZXJIZWlnaHQoKTtcblxuICAgIC8qKlxuICAgICAqIFB1bWEgR2xvYmFsIE1vZHVsZVxuICAgICAqL1xuICAgIGRzX3B1bWFHbG9iYWwoKTtcbiAgICAvKipcbiAgICAgKiBNb2JpbGUgbWVudSBuYXZpZ2F0aW9uXG4gICAgICovXG4gICAgLy8gTW9iaWxlIG1lbnUgdG9nZ2xlXG4gICAgZHNfaGVhZGVyTWVudVRvZ2dsZSgnLmpzLW0tYnVyZ2VyLXRvZ2dsZScpO1xuICAgIC8vIE1vYmlsZSBtZW51IHN1Ym1lbnUgdG9nZ2xlXG4gICAgZHNfaGVhZGVyTWVudVN1Yk1lbnVUb2dnbGUoJy5qcy1tLWJ1cmdlci13cmFwJywgJy5qcy1tLWJ1cmdlci10b2dnbGUnKTtcbiAgICAvLyBNb2JpbGUgbWVudSBzd2lwZSB1cCBjbG9zZVxuICAgIGRzX2hlYWRlck1vYmlsZVN3aXBlVXAoJy5qcy1tLWJ1cmdlci10b2dnbGUnKTtcblxuICAgIC8qKlxuICAgICAqIERlc2t0b3AgbWVudSBuYXZpZ2F0aW9uXG4gICAgICovXG4gICAgLy8gRGVza3RvcCBidXJnZXIgbWVudSB0b2dnbGVcbiAgICBkc19oZWFkZXJNZW51VG9nZ2xlKCcuanMtZC1idXJnZXItdG9nZ2xlJyk7XG4gICAgLy8gRGVza3RvcCBidXJnZXIgbWVudSBzdWJtZW51IHRvZ2dsZVxuICAgIGRzX2hlYWRlck1lbnVTdWJNZW51VG9nZ2xlKCcuanMtZC1idXJnZXItd3JhcCcsICcuanMtZC1idXJnZXItdG9nZ2xlJyk7XG4gICAgZHNfaGVhZGVyU2VhcmNoKCk7XG5cbiAgICAvKipcbiAgICAgKiBVdGlsc1xuICAgICAqL1xuICAgIGRzX2NvbGxhcHNlKCk7XG4gICAgZHNfcmVhZE1vcmUoKTtcbiAgICBkc190b2dnbGVFbGVtZW50KCk7XG4gICAgLy8gRW5hYmxlIGlmIHVzaW5nIEdyaWRkZXJcbiAgICBkc19ncmlkZGVySW5pdCgpO1xuXG4gICAgLy8gTW92ZSB0byBqcy1ibG9nLmpzIGlmIG5vdCB1c2luZyBDb250ZW50IGJsb2NrIHdpdGggbG9hZCBtb3JlXG4gICAgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1hamF4LWJsb2NrJykpIHtcbiAgICAgICAgZHNfbG9hZE1vcmVCbG9nKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGlicmFyaWVzXG4gICAgICovXG4gICAgbmV3IERTTVBNZWRpYUNvbnRyb2xzKCk7XG4gICAgbmV3IERTTVBUYWJzVGFiKCk7XG4gICAgbmV3IERTTVBUYWJzRHJvcGRvd24oKTtcbiAgICBuZXcgRFNNUFRhYnNUYWJEcm9wZG93bigpO1xuICAgIHZlcnRpY2FsVGFic0NQVCgpO1xuICAgIGRzX3JldGFpbEx1YnJpY2FudHNGaWx0ZXJzKCk7XG4gICAgZHNfbHVicmljYW50c19maWx0ZXJzKCk7XG4gICAgZHNfcmVzb3VyY2VzX2RhdGEoKTtcbiAgICBkc19vcGVuaW5nc19maWx0ZXJzKCk7XG5cbiAgICBjYWxsU2xpZGVycygpO1xuICAgIGNhbGxBY2NvcmRpb25zKCk7XG4gICAgY2FsbFRhYkFjY29yZGlvbnNNb2JpbGUoKTtcbiAgICAvLyAzRCBJbWFnZSBTcGlubmVyXG4gICAgY2FsbEltYWdlU3Bpbm5lcnMoKTtcblxuICAgIC8qKlxuICAgICAqIENvbXBvbmVudHNcbiAgICAgKi9cbiAgICBuZXcgUHVyZUNvdW50ZXIoe1xuICAgICAgICBzZWxlY3RvcjogJy5jLWNvdW50ZXJfX251bWJlcicsXG4gICAgfSk7XG5cbiAgICBuZXcgUHJvZ3Jlc3NDaXJjbGVDb3VudGVyKHtcbiAgICAgICAgcGVyY2VudGFnZTogODAsXG4gICAgfSk7XG5cbiAgICBuZXcgRFNNUFZpZXdBbmltKHt9KTtcblxuICAgIGNvcnJlY3RDbGlwUGF0aCgpO1xufSk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge1xuICAgIC8vIEVuYWJsZSBpZiB1c2luZyBsYXp5IGxvYWQgb24gVmlkZW8gKHNldCBkYXRhLXNyYyBpbnN0ZWFkIG9mIHNyYylcbiAgICAvLyBsZXQgbGF6eUxvYWRJbnN0YW5jZSA9IG5ldyBMYXp5TG9hZCgpO1xufSk7XG4iXSwibmFtZXMiOlsiZHNfbG9hZE1vcmVCbG9nIiwiJCIsIkRTSW5pdEZpbHRlciIsIm1vZHVsZSIsImZpbHRlciIsImFjdGlvbiIsImZvcm0iLCJtb3JlQnRuIiwicmVzdWx0cyIsImRvaW5nX2FqYXgiLCJ0aW1lb3V0IiwicXVlcnkiLCJwb3N0X3R5cGUiLCJwZXJfcGFnZSIsInBhZ2UiLCJtYWluX3RheG9ub215IiwiY29udGVudF90eXBlIiwicmVnaW9uIiwibGFuZ3VhZ2UiLCJzZWFyY2giLCJjb21wb25lbnRfc3R5bGVzIiwiYWpheF91cmwiLCJkcyIsInByZWxvYWRlciIsImluaXQiLCJhamF4TW9kdWxlIiwiZGF0YSIsInBvc3RzX3Blcl9wYWdlIiwiZG9jdW1lbnQiLCJVUkwiLCJpbmRleE9mIiwicGFyYW1zIiwiVVJMU2VhcmNoUGFyYW1zIiwid2luZG93IiwibG9jYXRpb24iLCJnZXQiLCJpbml0RWxlbWVudHNBY3Rpb25zIiwiZmluZCIsIm1vcmVQb3N0cyIsImNoYW5nZUZvcm0iLCJjb21wQ2xhc3MiLCJjbGFzcyIsImNvbXBTdHlsZXMiLCJzdHlsZXMiLCJjb21wSW1hZ2UiLCJpbWFnZSIsIm9uIiwiZSIsInByZXZlbnREZWZhdWx0Iiwic2VuZEFqYXgiLCIkaW5wdXRfdGV4dCIsInVuYmluZCIsIm5vdCIsImtleXVwIiwia2V5Q29kZSIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiLCIkaW5wdXRfc3VibWl0IiwicGFyZW50IiwiYWRkQ2xhc3MiLCJjbGljayIsIiRzZWxlY3QiLCJjaGFuZ2UiLCIkY3VycmVudEl0ZW0iLCJ0YXJnZXQiLCIkaW5wdXRUYXJnZXQiLCJjb25jYXQiLCIkc2VsZWN0ZWRPcHRpb24iLCJ2YWwiLCJ0cmlnZ2VyIiwiJGxpc3QiLCJmaXJzdCIsInJlbW92ZUNsYXNzIiwiJGFjdGl2ZVRlcm0iLCJfZmlsdGVyJGZvcm0kZmluZCIsImF0dHIiLCJwcm9wIiwiZXZlbnQiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJwdXNoX3N0YXRlIiwiYWJvcnQiLCJyZW1vdmUiLCJwYWdlZCIsInMiLCJjb21wb25lbnQiLCJkZXZpY2UiLCJ3aWR0aCIsInNlcmlhbGl6ZSIsImFqYXgiLCJ1cmwiLCJ0eXBlIiwiYmVmb3JlU2VuZCIsInhociIsImFwcGVuZCIsImJ1aWxkX3VybCIsInN1Y2Nlc3MiLCJodG1sIiwicG9zdHMiLCJtYXhfcGFnZXMiLCJoaWRlIiwic2hvdyIsInRvdGFsX3Bvc3RzX3Nob3dpbmciLCJ0ZXh0IiwidG90YWxfcG9zdHMiLCJfZmlsdGVyJGZvcm0kZmluZCRmaXIiLCJ1cmxfcGFyc2Vfc2lkZSIsImhyZWYiLCJzcGxpdCIsIm9sZFVybCIsImhpc3RvcnkiLCJzdGF0ZSIsInBhdGgiLCJpbnB1dFB1c2hVcmwiLCJlYWNoIiwialF1ZXJ5Iiwic2VhcmNoUGFyYW1zIiwic2V0IiwiZGVjb2RlZF91cmwiLCJkZWNvZGVVUklDb21wb25lbnQiLCJ0b1N0cmluZyIsInB1c2hTdGF0ZSIsImRvSW5pdCIsImkiLCJhZGRFdmVudExpc3RlbmVyIiwiaXRlbSIsInJlSW5pdEZpbHRlciIsInBhcnNlZFVybCIsImN1cnJlbnRVcmwiLCJjbGVhbmVkVXJsIiwidHJpZ2dlckNoYW5nZSIsImluZGV4IiwiZWxlbSIsIl9wYXJhbXMkZ2V0IiwiJHRoaXMiLCJfcGFyYW1zJGdldDIiLCJ2YWx1ZSIsImhhc0NsYXNzIiwic2VsZWN0ZWRPcHRpb24iLCIkbmV3U2VsZWN0ZWRPcHRpb24iLCJjb3JyZWN0Q2xpcFBhdGgiLCJvbmxvYWQiLCJiYXNlSGVpZ2h0IiwiYmFzZVdpZHRoIiwiaW1hZ2VzIiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJpbWciLCJzZXRDbGlwUGF0aCIsIm9ucmVzaXplIiwiaW1hZ2VIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJwcm9wb3J0aW9uYWxXaWR0aCIsImNsaXBQYXRoVmFsdWUiLCJjbGllbnRXaWR0aCIsInN0eWxlIiwiY2xpcFBhdGgiLCJyZWdpc3RlclBsYXliYWNrQ29udHJvbFBsdWdpbiIsInJlZ2lzdGVyRnJhbWVzTmF2Q29udHJvbFBsdWdpbiIsInJlZ2lzdGVyWm9vbUNvbnRyb2xQbHVnaW4iLCJyZWdpc3RlckZ1bGxzY3JDb250cm9sUGx1Z2luIiwicmVnaXN0ZXJQcm9ncmVzc0ZyYWN0aW9uUGx1Z2luIiwicmVnaXN0ZXJIb3RTcG90c1BsdWdpbiIsImlzRHJhZ09uIiwiaXNQbGF5YmFja09uIiwiaXNGcmFtZXNOYXZPbiIsImlzWm9vbU9uIiwiaXNGdWxsU2NyZWVuT24iLCJpc0ZyYWN0aW9uT24iLCJpc0FuaW1hdGVPbiIsImlzSG90c3BvdHNPbiIsInNwaW5uZXJFbGVtTmFtZSIsInNwaW5uZXJNb2R1bGVXcmFwIiwic3Bpbm5lck1vZHVsZUxpc3QiLCJjYWxsSW1hZ2VTcGlubmVycyIsInNwaW5uZXJPcHRpb25zIiwic3Bpbm5lck1vZHVsZSIsImltZ1NwaW5uZXJFbGVtIiwicXVlcnlTZWxlY3RvciIsImltZ1BhdGgiLCJnZXRBdHRyaWJ1dGUiLCJpbWdQcmVmaXgiLCJpbWdEaWdpdHMiLCJpbWdDb3VudCIsImltZ0V4dCIsInNwaW5uZXJJRCIsInNldEF0dHJpYnV0ZSIsInNvdXJjZSIsIlNwcml0ZVNwaW4iLCJzb3VyY2VBcnJheSIsImZyYW1lIiwiZGlnaXRzIiwiem9vbVVzZUNsaWNrIiwiem9vbVBpbkZyYW1lIiwic2Vuc2UiLCJyZXNwb25zaXZlIiwiYW5pbWF0ZSIsInNpemVNb2RlIiwicmVuZGVyZXIiLCJwcmVsb2FkQ291bnQiLCJmcmFtZVRpbWUiLCJwbGF5VG9GcmFtZVRpbWUiLCJyZXZlcnNlIiwiZm9yY2VSZXZlcnNlIiwicGx1Z2lucyIsImJvb3RJbWFnZVNwaW5uZXIiLCJzZWxlY3RvciIsIm9wdGlvbnMiLCJvYnNlcnZlciIsIkludGVyc2VjdGlvbk9ic2VydmVyIiwiZW50cmllcyIsImVudHJ5IiwiaXNJbnRlcnNlY3RpbmciLCJ1bm9ic2VydmUiLCJzcHJpdGVzcGluIiwib2JzZXJ2ZSIsImNyZWF0ZUFjY29yZGlvbnMiLCJjYWxsQWNjb3JkaW9ucyIsIkRTTVBBY2NvcmRpb25zIiwiYWNjb3JkaW9uSUQiLCJhY2NvcmRpb25TZWxlY3RvciIsImFjY29yZGlvbkl0ZW1zIiwiYWNjb3JkaW9ucyIsImFjYyIsImFjY0lEIiwiY2FsbElEIiwiZHNibHNTbGlkZXIiLCJzaW1wbGVTbGlkZXJzIiwiYWR2YW5jZWRTbGlkZXJzIiwiY2lyY3VsYXJTbGlkZXJzIiwiZXh0ZW5kZWRTbGlkZXJzIiwiY2FsbFNsaWRlcnMiLCJTd2lwZXJXaXRoVGFicyIsImlzQXV0b1BsYXlPbiIsImlzTGF6eUxvYWRPbiIsImlzQnJlYWtwb2ludHNPbiIsImlzTmF2aWdhdGlvbk9uIiwiaXNMb29wT24iLCJpc1BhZ2luYXRpb25PbiIsInVfcGFyc2VCb29sIiwiYXV0b3BsYXlPYnNlcnZlciIsImlzRWZmZWN0T24iLCJhZHZhbmNlZE5hbWUiLCJhZHZTbGlkZXJTZWwiLCJhZHZTbGlkZXJUYWJzIiwiYWR2U2xpZGVyTGlzdCIsImFkdlNsaWRlck9wdGlvbnMiLCJhZHZTbGlkZXJzIiwic2xpZGVyVGFiT3B0aW9ucyIsImFkdlNsaWRlck5hdiIsInNsaWRlck5hdiIsImFkdlNsaWRlclRodW1icyIsInNsaWRlclRodW1iT3B0aW9ucyIsImFkdmFuY2VkT2JzZXJ2ZXIiLCJzbGlkZXIiLCJ0cmlnZ2VyVHlwZSIsImFjdGl2ZSIsInNwYWNlQmV0d2VlbiIsInNsaWRlc1BlclZpZXciLCJmcmVlTW9kZSIsInRocmVzaG9sZCIsIndhdGNoU2xpZGVzUHJvZ3Jlc3MiLCJ3cmFwcGVyQ2xhc3MiLCJpc1RodW1icyIsInNsaWRlcklEIiwic2xpZGVyUGFyZW50IiwiY2xvc2VzdCIsInNsaWRlclRodW1ic1NlbGVjdG9yIiwic2xpZGVyVGh1bWJzSUQiLCJzbGlkZXJUYWJJRCIsImVsZW1lbnQiLCJpc1ZlcnRpY2FsIiwiZGlyZWN0aW9uIiwiY2xhc3NMaXN0IiwiYWRkIiwiU3dpcGVyIiwidGh1bWJzIiwic3dpcGVyIiwibm9Td2lwaW5nU2VsZWN0b3IiLCJpbml0aWFsaXplZCIsImlzQXV0b3BsYXkiLCJhdXRvcGxheU9ic2VydmUiLCJhdXRvcGxheSIsInN0b3AiLCJwdXNoIiwiU3dpcGVyV2l0aENpcmN1bGFyVGFicyIsImlzQ2VudGVyU2xpZGVzIiwiaXNTeW1tZXRyaWMiLCJjU2xpZGVyTmF2IiwiaW5pdGlhbEluZGV4IiwicGFyc2VJbnQiLCJzZXRQcm9wZXJ0eSIsImluaXRpYWxTbGlkZSIsIkRTTVBTbGlkZXJEU0JMUyIsImRzYmxzU2VsIiwiZHNibHNTZWxNb2IiLCJkc2Jsc1NsaWRlckxpc3QiLCJkc2Jsc1NsaWRlck1vYmlsZUxpc3QiLCJkc2JscyIsInNsaWRlck1vYmlsZUlEIiwiYWR2U2xpZGVyQ29udGVudCIsImFkdkNvbnRlbnRPcHRpb25zIiwiYWR2U2xpZGVyc0NvbnRlbnQiLCJhUmVxIiwic2xpZGVyQ29udGVudCIsInNsaWRlckNvbnRlbnRJRCIsInNsaWRlckNvbnRlbnRTZWxlY3RvciIsImNvbnRyb2xsZXIiLCJjb250cm9sIiwic2xpZGVyUHJvZ3Jlc3MiLCJkdXJhdGlvbiIsImRlbGF5IiwiYW5pbWF0ZVByb2dyZXNzIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJlbCIsInN0YXJ0IiwicHJldmlvdXNUaW1lU3RhbXAiLCJkb25lIiwic3RlcCIsInRpbWVzdGFtcCIsImVsYXBzZWQiLCJwcm9nIiwiTWF0aCIsIm1pbiIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInNpbXBsZU5hbWUiLCJzaW1wbGVTbGlkZXJTZWwiLCJzaW1wbGVTbGlkZXJMaXN0Iiwic2ltcGxlU2xpZGVyT3B0aW9ucyIsInNpbXBsZVNsaWRlcnNMaXN0Iiwic2ltcGxlT2JzZXJ2ZXIiLCJjb250YWlucyIsImZpbHRlclNsaWRlcnMiLCJzbGlkZXJDb2x1bW5zIiwic2xpZGVySXRlbXMiLCJzY3JlZW4iLCJfaXRlcmF0b3IiLCJfY3JlYXRlRm9yT2ZJdGVyYXRvckhlbHBlciIsInBhcmVudE5vZGUiLCJfc3RlcCIsIl9sb29wIiwidGh1bWJzTmF2IiwidGh1bWJzTmF2QnRucyIsInRvdGFsU2xpZGVzIiwiY3VySW5kZXgiLCJyZWFsSW5kZXgiLCJfaXRlcmF0b3IyIiwiX3N0ZXAyIiwibiIsInRodW1ic05hdkJ0biIsImVyciIsImYiLCJfaXRlcmF0b3IzIiwiX3N0ZXAzIiwiZ290byIsInNsaWRlVG9Mb29wIiwic2xpZGVyQ29udGFpbmVyIiwic2xpZGVzIiwiZmlsdGVyQ29udGFpbmVyIiwiZmlsdGVySXRlbXMiLCJmaWx0ZXJEcm9wZG93biIsImlzSGFzaGVkIiwiZXYiLCJjbGlja2VkSXRlbSIsImN1cnJlbnRUYXJnZXQiLCJjbGlja2VkSXRlbVBhcmVudCIsImNsaWNrZWQiLCJjbGlja2VkRmlsdGVyIiwiY2xpY2tlZEhyZWYiLCJ1cmxTcGxpdCIsIm5ld0hhc2giLCJoYXNoIiwiZmlsdGVyU2xpZGVzIiwiZmlsdGVyU3RyaW5nIiwic2xpZGVzQ2F0ZWdvcmllcyIsImhhc0ZpbHRlciIsImoiLCJkaXNwbGF5IiwidXBkYXRlU2l6ZSIsInVwZGF0ZVNsaWRlcyIsInVwZGF0ZVByb2dyZXNzIiwidXBkYXRlU2xpZGVzQ2xhc3NlcyIsInNjcm9sbGJhciIsIkRTTVBUYWJUb0FjY29yZGlvbk1vYmlsZSIsInRhYmFjY0lEIiwidGFiYWNjU2VsZWN0b3IiLCJ0YWJhY2NJdGVtcyIsImNhbGxUYWJBY2NvcmRpb25zTW9iaWxlIiwidGFJRCIsImRzX3JlYWRNb3JlIiwicmVhZE1vcmVXcmFwcGVycyIsInJlYWRNb3JlV3JhcHBlciIsInJlYWRNb3JlQnRuIiwiYnRuVGV4dE5vQWN0aXZlIiwiYnRuVGV4dEFjdGl2ZSIsImNoaWxkcmVuIiwidGV4dENvbnRlbnQiLCJyZWFkTW9yZVRleHQiLCJpc0FjdGl2ZSIsInJlYWRNb3JlVGV4dEhlaWdodCIsInNjcm9sbEhlaWdodCIsIm1heEhlaWdodCIsIm9wZW5Nb2JpbGVNZW51IiwiY2xvc2VNb2JpbGVNZW51IiwiZHNfaGVhZGVyTWVudVRvZ2dsZSIsImJ0biIsImJvZHkiLCJ1X2lzVG91Y2hEZXZpY2UiLCJkc19oZWFkZXJNb2JpbGVTd2lwZVVwIiwibW9iaWxlTmF2IiwieERvd24iLCJ5RG93biIsInRvdWNoIiwiaXNTY3JvbGxhYmxlWSIsIm9mZnNldEhlaWdodCIsImhhbmRsZVRvdWNoTW92ZSIsImV2dCIsInhVcCIsInRvdWNoZXMiLCJjbGllbnRYIiwieVVwIiwiY2xpZW50WSIsInhEaWZmIiwieURpZmYiLCJhYnMiLCJoYW5kbGVUb3VjaFN0YXJ0IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm9uY2UiLCJ1X2hpZGVFbGVtIiwidV9zaG93RWxlbSIsImRzX2hlYWRlclNlYXJjaCIsInRhcmdldHMiLCJpbnB1dCIsInNob3dPdmVybGF5IiwiZm9jdXMiLCJjbG9zZU92ZXJsYXkiLCJtYXRjaGVzIiwia2V5IiwidV90aHJvdHRsZWQiLCJkc19oZWFkZXJTdGlja3kiLCJlbENsYXNzIiwiJCRoZWFkZXIiLCJlbEhlaWdodCIsIm9mZnNldCIsIm9uU2Nyb2xsIiwicGFnZVlPZmZzZXQiLCJ0aHJvdHRsZVNjcm9sbCIsImNoZWNrQ2hpbGRTdWJNZW51IiwiY2xvc2VTdWJNZW51Iiwib3BlblN1Yk1lbnUiLCJkc19oZWFkZXJNZW51U3ViTWVudVRvZ2dsZSIsImNsb3NlRWwiLCJlbGUiLCJjbG9zZUVsZSIsInRvZ2dsZUJ1dHRvbnMiLCJ0b2dnbGVCdXR0b24iLCJ0b2dnbGVDb250ZW50IiwibmV4dEVsZW1lbnRTaWJsaW5nIiwidG9nZ2xlQnV0dG9uTWVudUl0ZW0iLCJwYXJlbnRFbGVtZW50IiwiaXNUb2dnbGVkIiwiY2xhc3NOYW1lIiwiaW5jbHVkZXMiLCJuZXdJdGVtIiwiY3JlYXRlRWxlbWVudCIsImFwcGVuZENoaWxkIiwiZGVzdGluYXRpb24iLCJsaW5rIiwic3ViTWVudSIsImRzX3B1bWFHbG9iYWwiLCIkdGFyZ2V0Iiwic3RvcFByb3BhZ2F0aW9uIiwiY291bnRyaWVzIiwiY29sdW1ucyIsImNlaWwiLCJpdGVtc1BlckNvbHVtbiIsImNvbHVtbiIsImNvdW50cnkiLCJzaG93SGlkZVN1Ykl0ZW0iLCJzdWJJdGVtIiwiYXJpYUF0dHIiLCJhcmlhRXhwYW5kZWQiLCJpdGVtUGFyZW50IiwiaXRlbU1lbnUiLCJ0b2dnbGVJbm5lckJ1dHRvbiIsIkFycmF5IiwiZnJvbSIsImdldEVsZW1lbnRzQnlDbGFzc05hbWUiLCJpbm5lckl0ZW0iLCJjaGlsZFN1Yk1lbnUiLCJpc0FuaW1hdGUiLCJpc0ZyYW1lc05hdiIsImlzRnVsbFNjcmVlbiIsImlzSG90c3BvdHMiLCJpc1BsYXliYWNrIiwiaXNGcmFjdGlvbiIsImlzWm9vbSIsImlzRHJhZyIsImZyYW1lc05hdkNvbnRyb2wiLCJzcGlubmVyRWxlbSIsImFwaSIsImhvdHNwb3RFbCIsImhzQ29udGVudExpc3RJdGVtIiwiY3RybEJ0dG5QcmV2IiwiY3RybEJ0dG5OZXh0IiwicHJldkZyYW1lIiwic3RhZ2UiLCJmYWRlSW4iLCJuZXh0RnJhbWUiLCJsYWJlbCIsInJlZ2lzdGVyUGx1Z2luIiwib25Mb2FkIiwiZnVsbHNjckNvbnRyb2wiLCJjdHJsQnR0bkZ1bGxTY3IiLCJyZXF1ZXN0RnVsbHNjcmVlbiIsInBsYXliYWNrQ29udHJvbCIsImN0cmxCdHRuUGxheSIsInRvZ2dsZUFuaW1hdGlvbiIsImlzUGxheWluZyIsInpvb21Db250cm9sIiwiY3RybEJ0dG5ab29tIiwidG9nZ2xlWm9vbSIsInRvZ2dsZUNsYXNzIiwibm9ybWFsaXplSXRlbUluZGV4IiwiYXJyIiwiaXRlbUluZGV4IiwiYXNzaWduSG90c3BvdHMiLCJob3RzcG90c0hUTUwiLCJiaW5kIiwicHJlcGVuZCIsImhvdHNwb3RzTmF2IiwiaHNfZnJhbWVzX2xpc3QiLCJoc19mcmFtZXMiLCJoc0NvbnRlbnRMaXN0IiwiaG90c3BvdHMiLCJhY3RpdmVGcmFtZUluZGV4IiwiYWN0aXZlSG90c3BvdCIsImFjdGl2ZUhvdHNwb3RJbmRleCIsImhzIiwic2V0QWN0aXZlSG90c3BvdCIsImRlYWN0aXZhdGVIb3RzcG90IiwicGxheVRvIiwibmVhcmVzdCIsImRldCIsImN0cmxCdHRuUHJldkhvdHNwb3QiLCJjdHJsQnR0bk5leHRIb3RzcG90IiwicHJvZ3Jlc3NGcmFjdGlvbiIsInNwaW5uZXJGcmFjdGlvbiIsImVhc2VPdXRRdWFkIiwidCIsImIiLCJjIiwiZCIsImVhc2VJblF1YWQiLCJlYXNlSW5PdXRRdWFkIiwiZWFzZUluQ3ViaWMiLCJlYXNlT3V0Q3ViaWMiLCJlYXNlSW5PdXRDdWJpYyIsImVhc2VJblF1YXJ0IiwiZWFzZU91dFF1YXJ0IiwiZWFzZUluT3V0UXVhcnQiLCJlYXNlSW5RdWludCIsImVhc2VPdXRRdWludCIsImVhc2VJbk91dFF1aW50IiwiZWFzZUluU2luZSIsImNvcyIsIlBJIiwiZWFzZU91dFNpbmUiLCJzaW4iLCJlYXNlSW5PdXRTaW5lIiwiZWFzZUluRXhwbyIsInBvdyIsImVhc2VPdXRFeHBvIiwiZWFzZUluT3V0RXhwbyIsImVhc2VJbkNpcmMiLCJzcXJ0IiwiZWFzZU91dENpcmMiLCJlYXNlSW5PdXRDaXJjIiwiZWFzZUluRWxhc3RpYyIsInAiLCJhIiwiYXNpbiIsImVhc2VPdXRFbGFzdGljIiwiZWFzZUluT3V0RWxhc3RpYyIsImVhc2VJbkJhY2siLCJlYXNlT3V0QmFjayIsImVhc2VJbk91dEJhY2siLCJlYXNlSW5Cb3VuY2UiLCJlYXNlT3V0Qm91bmNlIiwiZWFzZUluT3V0Qm91bmNlIiwic2Nyb2xsVG9VdGlsIiwidG8iLCJjYWxsYmFjayIsImVhc2luZyIsInNjcm9sbFRvcCIsImRvY3VtZW50RWxlbWVudCIsImNsaWVudFRvcCIsImN1cnJlbnRUaW1lIiwiaW5jcmVtZW50IiwiYW5pbWF0ZVNjcm9sbCIsImVhc2luZ1ZhbHVlIiwic2Nyb2xsVG8iLCJkc19jb2xsYXBzZSIsInRyaWdnZXJzIiwic2VsZWN0b3JUZXh0Q2xvc2VkIiwic2VsZWN0b3JUZXh0T3BlbmVkIiwiY29sbGFwc2UiLCJpbm5lckhUTUwiLCJmbm1hcCIsInRvZ2dsZSIsImNtZCIsImRzX2dyaWRkZXJJbml0IiwiZ3JpZGRlckVsZW1lbnRzIiwiTnVtYmVyIiwiZGF0YXNldCIsImdyaWRkZXJDb2x1bW5zIiwiZ2FwIiwiZ3JpZGRlckdhcCIsIkdyaWRkZXJKUyIsInVfdG9nZ2xlRWxlbSIsImRzX3RvZ2dsZUVsZW1lbnQiLCJjb250ZW50IiwiUHJvZ3Jlc3NDaXJjbGVDb3VudGVyIiwiX2NsYXNzQ2FsbENoZWNrIiwiZGVmYXVsdHMiLCJzdmciLCJzdmdDbGFzc2VzIiwiY29tcGxldGUiLCJpbmNvbXBsZXRlIiwicGVyY2VudGFnZSIsImNvbmZpZ09wdGlvbnMiLCJfb2JqZWN0U3ByZWFkIiwicmVnaXN0ZXJFdmVudExpc3RlbmVycyIsIl9jcmVhdGVDbGFzcyIsIl90aGlzIiwiZWxlbWVudHMiLCJpbnRlcnNlY3Rpb25TdXBwb3J0ZWQiLCJpbnRlcnNlY3Rpb25MaXN0ZW5lclN1cHBvcnRlZCIsImludGVyc2VjdE9ic2VydmVyIiwiYW5pbWF0ZUVsZW1lbnRzIiwicm9vdCIsInJvb3RNYXJnaW4iLCJhbmltYXRlTGVnYWN5IiwicGFzc2l2ZSIsIl90aGlzMiIsImVsZW1lbnRJc0luVmlldyIsIl90aGlzMyIsImVsbSIsImVsZW1lbnRDb25maWciLCJwYXJzZUNvbmZpZyIsImVsbVRleHQiLCJlbG1TdmciLCJlbG1Db21wbGV0ZSIsImVsbVBlcmNlbnRhZ2UiLCJlbG1EYXNoTGVuZ3RoIiwiZ2V0VG90YWxMZW5ndGgiLCJlbG1GaWxsIiwicGFyc2VGbG9hdCIsInN0cm9rZURhc2hvZmZzZXQiLCJzdHJva2VEYXNoYXJyYXkiLCJmaWxsTGVuZ3RoIiwiZGFzaExlbmd0aCIsImludGVyc2VjdGlvblJhdGlvIiwic3RhcnRDb3VudGVyIiwiZWxlbWVudFRleHQiLCJlbGVtZW50Q29tcGxldGUiLCJjb25maWciLCJfdGhpczQiLCJpbmNyZW1lbnRzUGVyU3RlcCIsImNvdW50TW9kZSIsImN1cnJlbnRDb3VudCIsInBhcnNlVmFsdWUiLCJjdXJyZW50RmlsbCIsImNvdW50ZXJXb3JrZXIiLCJzZXRJbnRlcnZhbCIsIm5leHROdW0iLCJuZXh0TnVtYmVyIiwibmV4dEZpbGwiLCJjbGVhckludGVydmFsIiwiX3RoaXM1IiwiYmFzZUNvbmZpZyIsImNvbmZpZ1ZhbHVlcyIsImNhbGwiLCJhdHRyaWJ1dGVzIiwidGVzdCIsIm5hbWUiLCJyZXBsYWNlIiwidG9Mb3dlckNhc2UiLCJPYmplY3QiLCJhc3NpZ24iLCJudW1iZXIiLCJzdGVwcyIsIm1vZGUiLCJ0b3AiLCJvZmZzZXRUb3AiLCJsZWZ0Iiwib2Zmc2V0TGVmdCIsIm9mZnNldFdpZHRoIiwiaGVpZ2h0Iiwib2Zmc2V0UGFyZW50IiwicGFnZVhPZmZzZXQiLCJpbm5lckhlaWdodCIsImlubmVyV2lkdGgiLCJJbnRlcnNlY3Rpb25PYnNlcnZlckVudHJ5IiwicHJvdG90eXBlIiwiUHVyZUNvdW50ZXIiLCJlbmQiLCJkZWNpbWFscyIsImxlZ2FjeSIsImN1cnJlbmN5IiwiY3VycmVuY3lzeW1ib2wiLCJzZXBhcmF0b3IiLCJzZXBhcmF0b3JzeW1ib2wiLCJmb3JtYXROdW1iZXIiLCJjb252ZXJ0VG9DdXJyZW5jeVN5c3RlbSIsInN5bWJvbCIsImxpbWl0IiwidG9GaXhlZCIsImFwcGx5U2VwYXJhdG9yIiwiUmVnRXhwIiwic3RyQ29uZmlnIiwibWluaW11bUZyYWN0aW9uRGlnaXRzIiwibWF4aW11bUZyYWN0aW9uRGlnaXRzIiwidG9Mb2NhbGVTdHJpbmciLCJjb3VudHJ5QWpheENhbGwiLCJjb250aW5lbnQiLCJhamF4RGF0YSIsImRhdGFUeXBlIiwicmVzcG9uc2UiLCJsdWJyaWNhbnRzQWpheENhbGwiLCJsdWJyaWNhbnRzIiwibG9hZE1vcmVBamF4Q2FsbCIsImRzX2x1YnJpY2FudHNfZmlsdGVycyIsImNvbnNvbGUiLCJsb2ciLCJjdXJyZW50UGFnZSIsInVfZXh0ZW5kT2JqZWN0IiwiRFNNUE1lZGlhQ29udHJvbHMiLCJ3cmFwcGVyIiwiYnV0dG9ucyIsInBsYXkiLCJtdXRlIiwiY2xvc2UiLCJjbGFzc2VzIiwicGF1c2UiLCJwbGF5aW5nIiwic291bmQiLCJwYXJlbnRQbGF5IiwicGFyZW50UGF1c2UiLCJ0cmlnZ2VyQXV0b3BsYXkiLCJjb250cm9scyIsIml0ZW1zIiwiaXNSZW1vdmVkRGVjb3JhdGlvbiIsInNlbGYiLCJiaW5kVG9nZ2xlUGxheSIsInRvZ2dsZVBsYXkiLCJiaW5kVG9nZ2xlTXV0ZSIsInRvZ2dsZU11dGUiLCJiaW5kRW5kZWRWaWRlbyIsImVuZGVkVmlkZW8iLCJfdG9Db25zdW1hYmxlQXJyYXkiLCJ2aWRlbyIsInZpZGVvQ29udGFpbmVyIiwiYnRuUGxheSIsImJ0bk11dGUiLCJzdGFydFBsYXkiLCJwYXJlbnRXcmFwIiwicGF1c2VkIiwiZW5kZWQiLCJtdXRlZCIsInN0b3BQbGF5Iiwiam9iVHlwZVNlbGVjdCIsImpvYkNhdFNlbGVjdCIsImpvYkxvY1NlbGVjdCIsImpvYlNlYXJjaEZvcm0iLCJqb2JTZWFyY2hJbnB1dCIsImxvYWRNb3JlQnRuIiwibm90aGluZ0ZvdW5kIiwibm9fcmVzdWx0cyIsInBwcCIsIml0ZW1zTnVtIiwiaXRlbXNWaXNpYmxlIiwiam9iVHlwZSIsImpvYkNhdCIsImpvYkxvYyIsImFwcFN0YXRlIiwiYXBwU3RhdGVJbml0aWFsIiwiU2VhcmNoVGl0bGUiLCJUaXRsZSIsIlNlYXJjaCIsImxvd2VyVGl0bGUiLCJsb3dlclNlYXJjaCIsInNlYXJjaFdvcmRzIiwiY29udGFpbnNTZWFyY2hXb3JkIiwid29yZCIsInRvdGFsIiwidmlzaWJsZSIsImNhdCIsImxvYyIsImNzcyIsIml0ZW1zQWxsIiwidGhpc0l0ZW0iLCJpdGVtVHlwZSIsIml0ZW1DYXQiLCJpdGVtTG9jIiwiaXRlbVRpdGxlIiwiaXRlbUFjdGl2ZSIsIml0ZW1zQWN0aXZlIiwiaXRlbXNDb3VudGVyIiwiaXRlbXNBY3RpdmVWaXNpYmxlIiwicmVzZXRTZWxlY3RGaWVsZHMiLCJkc19vcGVuaW5nc19maWx0ZXJzIiwic2VhcmNoVmFsdWUiLCJ0b3RhbEl0ZW1zIiwidmlzaWJsZUl0ZW1zIiwibm90aGluZ19mb3VuZCIsImRzX2RhdGFfc2hlZXQiLCJzaGVldExhbmciLCJkYXRhU2hlZXRBamF4IiwiZGF0YVNoZWV0U2VhcmNoIiwiZGF0YXNoZWV0cyIsImRzX2Jyb2NodXJlIiwiYnJvY2h1cmVSZWdpb24iLCJicm9jaHVyZUxhbmciLCJicm9jaHVyZUFqYXgiLCJicm9jaHVyZVNlYXJjaCIsImJyb2NodXJlcyIsImRzX3ZpZGVvcyIsInZpZGVvc1JlZ2lvbiIsInZpZGVvc0xhbmd1YWdlIiwidmlkZW9BamF4IiwidmlkZW9zU2VhcmNoIiwidmlkZW9zIiwiZHNfcmVzb3VyY2VzX2RhdGEiLCJvcHRpb25zRGVza3RvcCIsIm9wdGlvbnNNb2JpbGUiLCJzbGlkZUNsYXNzIiwicGFnaW5hdGlvbiIsImNsaWNrYWJsZSIsIm9wdGlvbnNOYXYiLCJzbGlkZXJObyIsInNsaWRlck5hbWUiLCJzbGlkZXJNb2JpbGVOYW1lIiwic2xpZGVyU2VsIiwic2xpZGVyTW9iaWxlU2VsIiwic2xpZGVyRWxlbSIsInNsaWRlck1vYmlsZUVsZW0iLCJzaG93TW9iaWxlIiwiaXNNb2JpbGUiLCJpc0Rlc2t0b3AiLCJkZXNrdG9wSW5zdGFuY2UiLCJtb2JpbGVJbnN0YW5jZSIsImRlc2t0b3BUYWJzIiwiY3VycmVudFdpZHRoIiwiYnJlYWtwb2ludCIsInBhcnNlT3B0aW9ucyIsImNyZWF0ZU1vYmlsZSIsImNyZWF0ZURlc2t0b3AiLCJ0aHJvdHRsZVJlc2l6ZSIsInJlc2l6ZVNsaWRlciIsImJhc2VuYW1lIiwibmV3V2lkdGgiLCJ1bmJpbmRUYWJzIiwiZGVzdHJveSIsImlzQXV0b3BsYXlEZWxheSIsImRpc2FibGVPbkludGVyYWN0aW9uIiwiaXNTcGVlZE9uIiwic3BlZWQiLCJzbGlkZXJzIiwib2JzZXJ2ZXJDYWxsYmFjayIsInNJbmRleCIsImNvbHVtbnNTdHIiLCJub0NvbHVtbnMiLCJjb2x1bW5zR2FwIiwiZm9yY2VDb2x1bW5zR2FwIiwiYnJlYWtwb2ludHMiLCJpc0VmZmVjdCIsImVmZmVjdCIsImZhZGVFZmZlY3QiLCJjcm9zc0ZhZGUiLCJwcmVsb2FkSW1hZ2VzIiwibGF6eSIsImxvYWRQcmV2TmV4dCIsImxvYWRPblRyYW5zaXRpb25TdGFydCIsImlzTG9vcCIsImxvb3AiLCJjdXJyZW50SUQiLCJuZXh0RWwiLCJwcmV2RWwiLCJuZXh0SUQiLCJwcmV2SUQiLCJzbGlkZXJOZXh0Iiwic2xpZGVyUHJldiIsImlzTmF2aWdhdGlvbiIsIm5hdmlnYXRpb24iLCJpc1BhZ2luYXRpb24iLCJsZWFkaW5nWmVybyIsImZvcm1hdEZyYWN0aW9uQ3VycmVudCIsImZvcm1hdEZyYWN0aW9uVG90YWwiLCJyZW5kZXJDdXN0b20iLCJjdXJyZW50IiwidG90YWxGb3JtYXRlZCIsImN1cnJlbnRGb3JtYXRlZCIsInByb2dyZXNzIiwiY2lyY2xlIiwicmlnaHQiLCJtaWRkbGUiLCJib3R0b20iLCJwb3NpdGlvbiIsImFycmFuZ2UiLCJhcnJhbmdlQ2VudGVyZWQiLCJpdGVtQWxpZ24iLCJpdGVtQW5nbGUiLCJyb3RhdGVBY3RpdmUiLCJzeW1tZXRyaWMiLCJzeW1tZXRyaWNPcmRlciIsImNvbnRhaW5lciIsInNoaWZ0Iiwic2hpZnRTeW1tZXRyaWMiLCJtdWx0aXBsaWVyIiwibnVtYmVyT2ZJdGVtcyIsImFycmFuZ2VTaGlmdCIsImZ1bGwiLCJhcnJhbmdlSW5kZXgiLCJ0YWJDbGlja2VkIiwidGFiQ2xpY2siLCJnZXRDb250YWluZXJSYWRpdXMiLCJnZXRJdGVtRGltZW5zaW9ucyIsInN3aXBlclNsaWRlQ2hhbmdlIiwiYmluZFRhYnMiLCJ1cGRhdGVJdGVtc1Bvc2l0aW9ucyIsInRhYiIsImlzVG91Y2giLCJjdXJyZW50VGFiIiwiY2xpY2tlZFRhYiIsInRhYkNoYW5nZSIsImN1cnJlbnRTbGlkZSIsImVsZW1zIiwiaW5kIiwiYW5nbGUiLCJyb3RhdGVTaGlmdCIsIm9iakNsYXNzZXMiLCJ2YWx1ZXMiLCJjdXJyZW50SW5kZXgiLCJkaXZpZGVyIiwiY29zaW5lIiwic2ludXMiLCJpdGVtU2lkZVgiLCJpdGVtU2lkZVkiLCJjbGFzc0l0ZW1zIiwickhlaWdodCIsInJXaWR0aCIsImlzU2VtaUNpcmNsZSIsImZsb29yIiwiUmVzaXplT2JzZXJ2ZXIiLCJwdXJlcmFkaXVzIiwiY29udGVudFJlY3QiLCJyYWRpdXMiLCJib3JkZXJCb3hTaXplIiwiaW5saW5lU2l6ZSIsIl9lbnRyeSRjb250ZW50UmVjdCIsImlzVG91Y2hEZXZpY2UiLCJ1X3NsaWRlRG93biIsInVfc2xpZGVVcCIsInVfZmFkZUluIiwidV9mYWRlT3V0Iiwic2VsZWN0b3JzIiwiZ2FsbGVyeSIsImFuaW1hdGlvbiIsIm9wZW4iLCJzdGFydENsb3NlZCIsImFuaW1hdGlvbkNvbnRlbnQiLCJhbmltYXRpb25HYWxsZXJ5Iiwic2Nyb2xsVG9WaWV3Iiwib3B0IiwiZXhwYW5kIiwiaGFzR2FsbGVyeSIsImFyaWEiLCJidXR0b24iLCJnZXRBcmlhTmFtZSIsImV2ZW50c0xpc3RlbmVycyIsInNob3VsZFNjcm9sbCIsIm1xbCIsIm1hdGNoTWVkaWEiLCJnYWxsZXJ5SXRlbXMiLCJoYW5kbGVycyIsInByZXZpb3VzSW5kZXgiLCJhZGRBcmlhIiwicHJlcGFyZUZvckFuaW1hdGlvbiIsImFjY29yZGlvbkJpbmRFdmVudHMiLCJyZUluaXQiLCJhY2NvcmRpb25VbmJpbmRFdmVudHMiLCJyZUluaXRBbmltYXRpb24iLCJldmVudHMiLCJvZmYiLCJoYW5kbGVyIiwiZXZlbnRIYW5kbGVyIiwic3BsaWNlIiwiZW1pdCIsImNvbnRleHQiLCJfbGVuIiwiYXJncyIsIl9rZXkiLCJpc0FycmF5Iiwic2xpY2UiLCJ1bnNoaWZ0IiwiZXZlbnRzQXJyYXkiLCJhcHBseSIsImFkZExpc3RlbmVyRm9jdXMiLCJhZGRMaXN0ZW5lckJsdXIiLCJhZGRLZXlMaXN0ZW5lciIsImhhbmRsZXJGdW5jIiwiYWNjb3JkaW9uTmF2Q2xpY2siLCJhY2NvcmRpb24iLCJlbGVtUGFyZW50IiwiZWxlbUNvbnRlbnQiLCJoZWFkZXIiLCJyZW1vdmVBdHRyaWJ1dGUiLCJyZW1vdmVTdHlsZXMiLCJjdXJyZW50SXRlbUNsaWNrZWQiLCJhY2NvcmRpb25Db250ZW50Y2hhbmdlIiwiY3VycmVudEl0ZW0iLCJjdXJyZW50SXRlbUNvbnRlbnQiLCJleHBhbmRlZCIsIml0ZW1Db250ZW50IiwiaXRlbVRyaWdnZXIiLCJhY2NvcmRpb25DaGFuZ2VHYWxsZXJ5Iiwic2Nyb2xsVG9BY2NvcmRpb24iLCJuZXh0QWNjb3JkaW9uIiwibmV4dEVsZW0iLCJudW1iZXJPZkVsZW0iLCJuZXh0RWxlbUl0ZW0iLCJwcmV2QWNjb3JkaW9uIiwicHJldkVsZW0iLCJwcmV2RWxlbUl0ZW0iLCJhY3RpdmVGb3VuZCIsImxpc3QiLCJpdGVtMENvbnRlbnQiLCJpc1NlbGZDbG9zZSIsImlzTGVhdmVPcGVuIiwiaXNTdGFydENsb3NlZCIsImlzR2FsbGVyeSIsImFuaW1hdGVDb250ZW50IiwiYW5pbWF0ZUdhbGxlcnkiLCJpc1Njcm9sbFRvVmlldyIsImlzVmFsaWRJZCIsImFyaWFOYW1lIiwid2hpY2giLCJ0cmlnZ2VyQ2xhc3MiLCJjdHJsTW9kaWZpZXIiLCJjdHJsS2V5IiwibWF0Y2giLCJuZXdJbmRleCIsInNjcm9sbEN1cnJlbnRDb250ZW50IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiZWxlbUhlaWdodCIsImN1cnJlbnRTY3JvbGxQb3MiLCJzY3JvbGxZIiwiYWpheENhbGwiLCJzZWdtZW50IiwidHlwZU9mVXNlIiwiZHNfcmV0YWlsTHVicmljYW50c0ZpbHRlcnMiLCJ0eXBlX2lkIiwiRFNNUFRhYnNDbGFzcyIsIkRTTVBUYWJzRHJvcGRvd24iLCJfRFNNUFRhYnNDbGFzcyIsIl9pbmhlcml0cyIsIl9zdXBlciIsIl9jcmVhdGVTdXBlciIsImRyb3Bkb3duIiwicGFuZWwiLCJzZWxlY3RvckRyb3Bkb3duIiwic2VsZWN0b3JQYW5lbHMiLCJpdGVtc0Ryb3Bkb3duIiwicGFuZWxzIiwibWVkaWFNYXRjaCIsIl9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuIiwiYmluZEZ1bmN0aW9ucyIsImJpbmRUYWJzRHJvcGRvd25FdmVudCIsIl9nZXQiLCJfZ2V0UHJvdG90eXBlT2YiLCJ0YWJEcm9wZG93bkNoYW5nZSIsIl9zZXQiLCJkcm9wZG93bnMiLCJjdXJyRHJvcGRvd24iLCJjdXJyZW50VGFiSUQiLCJzZWxlY3RlZEluZGV4IiwidW5iaW5kVGFic0Ryb3Bkb3duRXZlbnQiLCJEU01QVGFic1RhYiIsIm5hdiIsIkRTTVBUYWJzVGFiRHJvcGRvd24iLCJzZWxlY3RvclRhYnMiLCJpbml0VGFic0Ryb3Bkb3duIiwiYWN0aXZlTmF2IiwiYWN0aXZlUGFuZWwiLCJiaW5kVGFiTmF2RXYiLCJ0YWJOYXZDbGljayIsIm1lZGlhTWF0Y2hlcyIsImN1cnJlbnRTZWxlY3RvciIsImN1cnJlbnREcm9wZG93biIsInVwZGF0ZVRhYk5hdiIsInVwZGF0ZURyb3Bkb3duIiwiY3VycmVudE5hdkl0ZW0iLCJjdXJyZW50RHJvcCIsIm5ld0Ryb3BJbmRleCIsImN1cnJUYWIiLCJ1bmJpbmRUYWJzRHJvcEV2ZW50cyIsIm9uU3dpcGVTdGFydCIsIm9uU3dpcGVFbmQiLCJuZXh0VGFiIiwiZm91bmRJbmRleCIsIml0ZW1JRCIsImdldE5hdlRhYklEIiwiY2hhbmdlQWN0aXZlVGFiIiwicHJldlRhYiIsInRhYmxldCIsImRlc2t0b3AiLCJiaW5kVGFiUGFuZWxFdmVudCIsInVuYmluZFRhYlBhbmVsRXZlbnQiLCJiaW5kVGFiTmF2RXZlbnQiLCJ1bmJpbmRUYWJOYXZFdmVudCIsImNsZWFyQWN0aXZlQ2xhc3MiLCJzZXRBY3RpdmVDbGFzcyIsInRhYlBhbmVsQ2hhbmdlIiwiY3VycmVudFBhbmVsSUQiLCJjdXJyZW50UGFuZWwiLCJjdXJyZW50UGFuZWxIb2xkZXIiLCJkYXRhSUQiLCJzZWN0aW9uIiwic3dpcGVTdGFydCIsInBhZ2VYIiwidGFyZ2V0VG91Y2hlcyIsImNoYW5nZWRUb3VjaGVzIiwidGFiT3B0aW9ucyIsImFjY29yZGlvbk9wdGlvbnMiLCJhY2NvcmRpb25JbnN0YW5jZSIsInRhYkluc3RhbmNlIiwiYnVpbGRBY2NvcmRpb24iLCJidWlsZFRhYiIsImJ1aWxkVGFiQWNjb3JkaW9uIiwic2VsZWN0Q29udGluZW50IiwibG9hZGVyIiwiY29udGluZW50SUQiLCJjb250aW5lbnRJZCIsImJsb2NrSUQiLCJibG9ja19pZCIsIm5hdkxheW91dCIsIm5hdl9sYXlvdXQiLCJuYXZMYXlvdXRDbGFzc05hbWUiLCJzaG93TnVtYmVycyIsInNob3dfbnVtYmVycyIsInRyYW5zZm9ybU1vYmlsZSIsInRyYW5zZm9ybW1vYiIsImxlZnRCb3R0b21JbWFnZSIsImxlZnRib3R0b21pbWFnZSIsInBhcnNlSlNPTiIsImxheW91dCIsInRhYnNQYW5lbENsYXNzTmFtZSIsInRhYnNwYW5lbGNsYXNzbmFtZSIsImNvbHVtbnNPcmRlciIsImNvbHVtbnNvcmRlciIsInJpZ2h0VG9wSW1hZ2UiLCJyaWdodHRvcGltYWdlIiwicG9zdEluIiwiSlNPTiIsInBhcnNlIiwiY29udGluZW50TmV3Q29udGVudCIsIl9yZWYiLCJ2ZXJ0aWNhbFRhYnNDUFQiLCJhbmltYXRlRmFkZSIsIkRhdGUiLCJpZCIsInRpbWVQYXNzZWQiLCJkZWx0YSIsImVhc2luZ3MiLCJzd2luZyIsIm9wYWNpdHkiLCJsaW5lYXIiLCJxdWFkcmF0aWMiLCJjaXJjIiwiYWNvcyIsImJhY2siLCJ4IiwiYm91bmNlIiwicmVzdWx0IiwiZWxhc3RpYyIsImFkZE9ic2VydmVyIiwiY2IiLCJyZXBlYXQiLCJtYXJnaW4iLCJEU01QVmlld0FuaW0iLCJpblZpZXdwb3J0IiwiaW9CaW5kRXZlbnRzIiwidmlld3BvcnRSZXBlYXQiLCJ2aWV3cG9ydFRocmVzaG9sZCIsInZpZXdwb3J0TWFyZ2luIiwiX3RoaXMkY29uZmlnT3B0aW9ucyIsImF0dHJSZXBlYXQiLCJhdHRyVGhyZXNob2xkIiwiYXR0ck1hcmdpbiIsInRocm90dGxlSW5WaWV3IiwiRG9jdW1lbnRUb3VjaCIsIm5hdmlnYXRvciIsIm1heFRvdWNoUG9pbnRzIiwibXNNYXhUb3VjaFBvaW50cyIsImlzVG91Y2hIdG1sVXRpbCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwidV9hZGRUb3VjaFRvSHRtbCIsInRocm90dGxlSXNUb3VjaCIsInByb3BlcnR5IiwiY29uc3RydWN0b3IiLCJ1X2V4dGVuZCIsImV4dGVuZGVkT3B0aW9ucyIsInVfbWVyZ2VEZWVwIiwiaXNPYmplY3QiLCJvYmoiLCJfdHlwZW9mIiwia2V5cyIsInRhcmdldFZhbHVlIiwic291cmNlVmFsdWUiLCJ1X3Nob3dEaXNwbGF5IiwidV9oaWRlRGlzcGxheSIsImhpZGRlbiIsInVfaXNJbnRlZ2VyIiwic3RhcnRWYWx1ZSIsImRpZmZWYWx1ZSIsImR1cmVhdGlvbiIsImRpcmVjdGlvbnMiLCJPUEVOIiwiQ0xPU0UiLCJkaXNwbGF5VHlwZSIsInN0YXJ0aW5nSGVpZ2h0IiwiZGlzdGFuY2VIZWlnaHQiLCJzZXRFbGVtZW50QW5pbWF0aW9uU3R5bGVzIiwibm93Iiwic3RhcnRUaW1lIiwiYW5pbWF0aW9uQ29udGludWUiLCJuZXdIZWlnaHQiLCJyZW1vdmVFbGVtZW50QW5pbWF0aW9uU3R5bGVzIiwib3ZlcmZsb3ciLCJtYXJnaW5Ub3AiLCJtYXJnaW5Cb3R0b20iLCJwYWRkaW5nVG9wIiwicGFkZGluZ0JvdHRvbSIsInVfc2xpZGVUb2dnbGUiLCJnZXRDb21wdXRlZFN0eWxlIiwiaXNJbnRlZ2VyIiwiaXNGaW5pdGUiLCJ1X2lzT2JqZWN0IiwibyIsInN0ciIsImlzTmFOIiwidV9kZWJvdW5jZWQiLCJmdW5jIiwiaW1tZWRpYXRlIiwidGltZXJJZCIsImJvdW5kRnVuYyIsImNhbGxlZUZ1bmMiLCJfbGVuMiIsIl9rZXkyIl0sInNvdXJjZVJvb3QiOiIifQ==