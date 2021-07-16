//PhotoSwipe

var initPhotoSwipeFromDOM = function(gallerySelector) {
    var parseThumbnailElements = function(el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;
        for (var i = 0; i < numNodes; i++) {
            figureEl = thumbElements[i]; // <figure> element
            if (figureEl.nodeType !== 1) {
                continue;
            }
            linkEl = figureEl.children[0]; // <a> element
            size = linkEl.getAttribute('data-size').split('x');
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            };
            if (figureEl.children.length > 1) {
                item.title = figureEl.children[1].innerHTML;
            }
            if (linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src');
            }
            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item);
        }
        return items;
    };
    var closest = function closest(el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
    };
    var onThumbnailsClick = function(e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        var eTarget = e.target || e.srcElement;
        var clickedListItem = closest(eTarget, function(el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });
        if (!clickedListItem) {
            return;
        }
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;
        for (var i = 0; i < numChildNodes; i++) {
            if (childNodes[i].nodeType !== 1) {
                continue;
            }
            if (childNodes[i] === clickedListItem) {
                index = nodeIndex;
                break;
            }
            nodeIndex++;
        }
        if (index >= 0) {
            openPhotoSwipe(index, clickedGallery);
        }
        return false;
    };
    var photoswipeParseHash = function() {
        var hash = window.location.hash.substring(1),
            params = {};
        if (hash.length < 5) {
            return params;
        }
        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) {
                continue;
            }
            var pair = vars[i].split('=');
            if (pair.length < 2) {
                continue;
            }
            params[pair[0]] = pair[1];
        }
        if (params.gid) {
            params.gid = parseInt(params.gid, 10);
        }
        return params;
    };
    var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;
        items = parseThumbnailElements(galleryElement);
        options = {
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),
            getThumbBoundsFn: function(index) {
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect();

                return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
            },
            showAnimationDuration: 0,
            hideAnimationDuration: 0
        };
        if (fromURL) {
            if (options.galleryPIDs) {
                for (var j = 0; j < items.length; j++) {
                    if (items[j].pid == index) {
                        options.index = j;
                        break;
                    }
                }
            } else {
                options.index = parseInt(index, 10) - 1;
            }
        } else {
            options.index = parseInt(index, 10);
        }
        if (isNaN(options.index)) {
            return;
        }
        if (disableAnimation) {
            options.showAnimationDuration = 0;
        }
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
    };
    var galleryElements = document.querySelectorAll(gallerySelector);
    for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
    }
    var hashData = photoswipeParseHash();
    if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
    }
};

// $(window).load(function() {

// });
initPhotoSwipeFromDOM('.carousel-img');

//flickity trang cafe

let $carousel = $('.gallery__carousel');
$carousel.flickity({
    // options
    cellAlign: 'left',
    lazyLoad: 5,
    contain: true,
    wrapAround: true,
    prevNextButtons: false,
    draggable: true,




});


$('.btn-ctrl  .prev').on('click', function() {
    $carousel.flickity('previous');
});

$('.btn-ctrl  .next').on('click', function() {
    $carousel.flickity('next');
});
//flickity trang studiodetail
let $studioimg = $('.studio-carousel');
$studioimg.flickity({
    // options
    cellAlign: 'left',
    lazyLoad: 1,
    contain: true,
    wrapAround: true,
    prevNextButtons: false,
    draggable: true,
    pageDots: false,




});

$('.btn-ctrl  .prev').on('click', function() {
    $studioimg.flickity('previous');
});

$('.btn-ctrl  .next').on('click', function() {
    $studioimg.flickity('next');
});
//flickity trang projectdetail


let $fullsrc = $('.fullimg');
$fullsrc.flickity({
    fullscreen: true,
    pageDots: false,
    prevNextButtons: false,



})


//đổi màu svg
jQuery('img.svg').each(function() {
    var $img = jQuery(this);
    var imgID = $img.attr('id');
    var imgClass = $img.attr('class');
    var imgURL = $img.attr('src');

    jQuery.get(imgURL, function(data) {

        var $svg = jQuery(data).find('svg');
        if (typeof imgID !== 'undefined') {
            $svg = $svg.attr('id', imgID);
        }
        if (typeof imgClass !== 'undefined') {
            $svg = $svg.attr('class', imgClass + ' replaced-svg');
        }
        $svg = $svg.removeAttr('xmlns:a');
        if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
            $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
        }
        $img.replaceWith($svg);

    }, 'xml');

});


//menu moible

let navmoible = document.querySelector('header .nav');
let chua = document.querySelector('.container .btn-menu');


chua.addEventListener('click', function() {
    navmoible.classList.toggle('active');
    chua.classList.toggle('clicked');
})



//send 
let send = document.querySelector('footer .yl-footer .right-side .page .send-btn');
send.addEventListener('click', function() {
    alert('Your message was sent successfully !')
})




//tags

let tagText = document.querySelectorAll('.project .project-zone__tag .tag');
let tagList = document.querySelectorAll('.tag-table');
tagText.forEach(function(item, index) {
    item.addEventListener('click', function() {
        let tagID = index + 1;
        tagText.forEach(function(tag1) {
            tag1.classList.remove('active');
        });

        tagList.forEach(function(tag2) {
            tag2.classList.remove('active');
        });

        this.classList.add('active');

        document.querySelector('.table-' + tagID).classList.add('active');
    });
});


//form
function validateForm() {
    let u = document.getElementById("fullname").value;
    let n = document.getElementById("phonenumber").value;
    let e = document.getElementById("email").value;
    let p = document.getElementById("password").value;

    if (u == "" & n == "" & e == "" & p == "") {
        alert("Vui lòng điền đầy đủ thông tin !")
        return false;
    }
    if (u == "") {
        alert("Vui lòng nhập tên");
        return false;
    }
    if (n == "") {
        alert("Vui lòng nhập số điện thoại");
        return false;
    }
    if (e == "") {
        alert("Vui lòng nhập email");
        return false;
    }
    if (p == "") {
        alert("Vui lòng nhập mật khẩu");
        return false;
    }

    alert("Xác nhận thông tin thành công !")

    return true;
}

//chọn studio 

let choosestudio = document.querySelectorAll('.rental-body .rental-order .booking-from .choosen-studio .list-studio .item-studio')
choosestudio.forEach(function(itemstd, index) {
    itemstd.addEventListener('click', function() {

        choosestudio.forEach(function(tag1) {
            tag1.classList.remove('active');
        });

        this.classList.add('active');

    })
})

//more-desktop

let btnmoredesk = document.querySelector('.all-work .container .more .btn-all-work');
let allwork = document.querySelector('.project .project-zone .tag-table .last-project');
if (btnmoredesk) {
    btnmoredesk.addEventListener('click', function() {
        allwork.classList.toggle('active');
        btnmoredesk.classList.toggle('rotate');

    })
}


//more-moible

let btnmoremb = document.querySelector('.all-work .container .more-moible .btn-all-work');
let more = document.querySelector('.project .project-zone .tag-table .last-project');
if (btnmoremb) {
    btnmoremb.addEventListener('click', function() {

        more.classList.toggle('active');
        btnmoremb.classList.toggle('rotate');

    })
}