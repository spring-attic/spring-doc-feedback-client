var starsNumber = 0;
var countTry = 0;
var toc;

function start() {
  if (countTry < 3) {
    toc = document.getElementById('toc');
    if (toc) {
      build()
      return;
    }
  }
  countTry++;
  setTimeout(function() {
    start()
  }, 2000)
}

function build() {
  var feedbackHtml = '<div id="feedback-area" onmouseout="onStarMouseover(starsNumber)">' +
    '<span class="feedback-title">Send feedback</span>' +
    getStarsComponent('stars') +
    '</div>';
  if(document.getElementById('pageId') != null) {
    var feedback = document.createElement('div');
    feedback.innerHTML = feedbackHtml;

    var toc = document.getElementById('toc');
    var next = document.getElementById('toctitle').nextElementSibling;
    toc.insertBefore(feedback, next);
  }
}

function getIssueURL() {
    var metas = document.getElementsByTagName('meta');
    for (var i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute('name') === 'issue-url') {
            return metas[i].getAttribute('content');
        }
    }
    return '';
}

function getProjectName() {
    var metas = document.getElementsByTagName('meta');
    for (var i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute('name') === 'project') {
            return metas[i].getAttribute('content');
        }
    }
    return '';
}

function getPageId() {
  var pageIdElement = document.querySelector('#pageId > p');
  return pageIdElement.innerHTML;
}

function getDateString() {
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    var today = new Date();
    var thisDay = today.getDate();
    var thisMonth = monthNames[today.getMonth()];
    var thisYear = today.getFullYear();
    return thisDay + ' ' + thisMonth + ', ' + thisYear;
}

function getHeadings() {
    var activeTocElement = toc.getElementsByClassName('is-active-li');
    var headings = [];
    if (activeTocElement && activeTocElement.length > 0) {
        activeTocElement = activeTocElement[0];
        headings.push({
            text: activeTocElement.childNodes[0].textContent,
            href: activeTocElement.childNodes[0].href
        });
        while (activeTocElement.parentElement.parentElement.className === 'toc-list-item') {
            headings.push({
                text: activeTocElement.parentElement.parentElement.childNodes[0].textContent,
                href: activeTocElement.parentElement.parentElement.childNodes[0].href
            });
            activeTocElement = activeTocElement.parentElement.parentElement;
        }
    } else {
        headings.push({
            text: 'Top of document',
            href: ''
        })
    }
    return headings.reverse().map(function (value) {
        if (value.href) {
            return value.text + ' (' + value.href + ')';
        }
        return value.text;
    }).join(' > ');
}

var urlIssue = getIssueURL();
if (urlIssue) {
  if (document.getElementById('ref-issue')) {
    document.getElementById('ref-issue').setAttribute('href', urlIssue)
  }
} else {
  if (document.getElementById('p-issue')) {
    document.getElementById('p-issue').style.display = 'none';
  }
}

function getStarsComponent(id) {
    return '<div class="stars" id="' + id + '">' +
        '<span><a id="' + id + '1" class="star" onclick="onStarClick(1)" onmouseover="onStarMouseover(1)"></a></span>' +
        '<span><a id="' + id + '2" class="star" onclick="onStarClick(2)" onmouseover="onStarMouseover(2)"></a></span>' +
        '<span><a id="' + id + '3" class="star" onclick="onStarClick(3)" onmouseover="onStarMouseover(3)"></a></span>' +
        '<span><a id="' + id + '4" class="star" onclick="onStarClick(4)" onmouseover="onStarMouseover(4)"></a></span>' +
        '<span><a id="' + id + '5" class="star" onclick="onStarClick(5)" onmouseover="onStarMouseover(5)"></a></span>' +
        '</div>';
}

function onStarMouseover(index) {
    for (var i = 1; i <= 5; i++) {
        var a = document.getElementById('stars' + i);
        var b = document.getElementById('dialog-stars' + i);
        var clazz = (i <= index) ? 'star active' : 'star';
        if (a) {
            a.className = clazz;
        }
        if (b) {
            b.className = clazz;
        }
    }
}

function resetForm() {
    starsNumber = 0;
    document.getElementById('feedback-comment').value = '';
    document.getElementById('feedback-email').value = '';
    onStarMouseover(0);
}

function onStarClick(index) {
    starsNumber = index;
    MicroModal.show('modal-1', {disableScroll: true});
}

function submitFeedback(event) {
    try {
        event.preventDefault();
        var parser = new UAParser();
        var parserResult = parser.getResult();
        var path = window.location.pathname;
        var browserName = parserResult.browser.name;
        var browserVersion = parserResult.browser.version;
        var osName = parserResult.os.name;
        var osVersion = parserResult.os.version;
        var timestamp = new Date().getTime();
        var obj = {
            'starNumber': starsNumber,
            'feedbackText': document.getElementById('feedback-comment').value,
            'email': document.getElementById('feedback-email').value,
            'projectName': getProjectName(),
            'pageId': getPageId(),
            'path': path,
            'browserName': browserName,
            'browserVersion': browserVersion,
            'osName': osName,
            'osVersion': osVersion,
            'timestamp': timestamp,
            'dateString': getDateString(),
            'heading': getHeadings()
        };
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://spring-docs-feedback.cfapps.io/feedback', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(obj));
        resetForm();
        MicroModal.close('modal-1');
        alert('Your feedback has been sent.')
    } catch (e) {
      console.log(e)
        alert('An error occurred while sending your feedback.')
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
  start();
});
