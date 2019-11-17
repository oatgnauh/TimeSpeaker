var flag ;
var voiceStatus = true;
var synth       = window.speechSynthesis;
const speaker   = new SpeechSynthesisUtterance();
var voiceSelect = document.querySelector('select');
var rate = document.querySelector('#rate');
var rateValue = document.querySelector('.rate-value');
var voices;

var ShowTimer = null;
var rollTimer = null;
Init();

function Init()		//初始化工作
{
    document.getElementById("time").innerHTML = new Date().toTimeString().substr(0,8)
    document.getElementById('pixblock_vertical').offsetLeft = document.body.offsetWidth/2;
    synth.onvoiceschanged = populateVoiceList;
    document.getElementById("date").innerHTML = new Date().toDateString() + " @Lichard";
    synth.getVoices();
};

function populateVoiceList() 		//弹出声音选项
{
    window.console.log("execute population");	
    synth.onvoiceschanged = null;	
    var _voices = synth.getVoices();
    window.console.log(_voices.length);
    voices = _voices.sort(function (a, b) {
        const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
        if ( aname < bname ) return -1;
        else if ( aname == bname ) return 0;
        else return +1;
    });
    var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
    voiceSelect.innerHTML = '';
    window.console.log(voices.length);
    for(i = 0; i < voices.length ; i++) 
    {
        window.console.log(voices[i]);
        var option = document.createElement('option');
        option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
        
        if(voices[i].default) {
            option.textContent += ' -- DEFAULT';
        }

        option.setAttribute('data-lang', voices[i].lang);
        option.setAttribute('data-name', voices[i].name);
        voiceSelect.appendChild(option);
    }
    voiceSelect.selectedIndex = selectedIndex;
};


function TTS(num, fullDate) 	//text to speech
{
    if(!voiceStatus)
        return;
    window.console.log(fullDate);
    speaker.text  = num.toString();
    synth.speak(speaker);
};

function displayTime()
{
    if(!flag)
        return;
    function complete(num)
    {
        if(num < 10)
            return '0'+ num.toString();
        else
            return num.toString();
    }
    var date    =  new Date();
    var hours   = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    
    TTS(seconds,date.toString());
    var contend = complete(hours) + ":" + complete(minutes) +":" + complete(seconds);
    document.getElementById("time").innerHTML =  contend;
};

function startRollig()		//方块移动
{
    var horizontal = document.getElementById('pixblock_horizontal');
    var vertical   = document.getElementById('pixblock_vertical');

    var speed = 1;
    rollTimer = setInterval(allWayRoll, speed);
    
    var horizontalMove = "right";
    var vertivalMove = "down";

    function allWayRoll()
    {
        roll(horizontalMove);
        roll(vertivalMove);
    };

    function roll(action)
    {
        var horizontalLeft = parseInt(horizontal.style.left);
        var verticalTop    = parseInt(vertical.style.top);
        switch(action)
        {
            case "left":
                horizontalLeft--;
                horizontal.style.left = horizontalLeft + 'px';
                if(horizontalLeft <= -100 )
                    horizontalMove = "right";
                break;
            case "right":
                horizontalLeft ++;
                horizontal.style.left = horizontalLeft + 'px';
                if(horizontalLeft >= document.body.offsetWidth )
                    horizontalMove = "left";
                break;
            case "up":
                verticalTop --;
                vertical.style.top = verticalTop + "px";
                if(verticalTop < -(document.body.offsetHeight - 100))
                    vertivalMove = "down";
                break;
            case "down":
                verticalTop ++;
                vertical.style.top = verticalTop + "px";
                if(verticalTop > (document.body.offsetHeight/3 - 250))
                    vertivalMove = "up";
                break;
        }
    };
};

function Mute()
{
    var buttonText;
    if(voiceStatus)
    {
        synth.pause();
        buttonText = "Play";
    }
    else
    {
        synth.resume();
        buttonText = "Mute";
    }
    voiceStatus = !voiceStatus;
    document.getElementById("mute").innerHTML = buttonText;
}

function stop()
{
    flag = false;
    clearInterval(ShowTimer);
    clearInterval(rollTimer);
    synth.cancel();
    ShowTimer = null;
    rollTimer = null;
};

function start()
{
    flag = true;
    try
    {
        var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
        for(i = 0; i < voices.length ; i++) 
        {
            if(voices[i].name === selectedOption) 
            {
                speaker.voice = voices[i];		//下拉列表中选声音
                break;
            }
        }
    }
    catch(e)
    {
        
    }
    speaker.rate = rate.value;
    ShowTime = setInterval("displayTime()",1000);
    startRollig();
};

rate.onchange = function() {
    rateValue.textContent = rate.value;
};

//蛛网效果
!function() 
{
    function n(n, e, t) {
        return n.getAttribute(e) || t
    }

    function e(n) {
        return document.getElementsByTagName(n)
    }

    function t() {
        var t = e("script"),
        o = t.length,
        i = t[o - 1];
        return {
            l: o,
            z: n(i, "zIndex", -1),      //层级
            o: n(i, "opacity", 100),     //透明度
            c: n(i, "color", "255, 0, 0"),    //线条颜色
            n: n(i, "count", 200)    //线条数量
        }
    }

    function o() 
    {
        a = m.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        c = m.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }

    function i() 
    {
        r.clearRect(0, 0, a, c);
        var n, e, t, o, m, l;
        s.forEach(function(i, x) {
            for (i.x += i.xa, i.y += i.ya, i.xa *= i.x > a || i.x < 0 ? -1 : 1, i.ya *= i.y > c || i.y < 0 ? -1 : 1, 
                r.fillRect(i.x - .5, i.y - .5, 1, 1), e = x + 1; e < u.length; e++) n = u[e],
                null !== n.x && null !== n.y && (o = i.x - n.x, m = i.y - n.y, 
                l = o * o + m * m, l < n.max && (n === y && l >= n.max / 2 && (i.x -= .03 * o, i.y -= .03 * m), 
                t = (n.max - l) / n.max, r.beginPath(), r.lineWidth = t / 2,
                r.strokeStyle = "rgba(" + d.c + "," + (t + .2) + ")", r.moveTo(i.x, i.y), r.lineTo(n.x, n.y), r.stroke()))
        }),
        x(i)
    }

    var a, c, u, m = document.createElement("canvas"),
    d = t(),
    l = "c_n" + d.l,
    r = m.getContext("2d"),
    x = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(n) {
        window.setTimeout(n, 1e3 / 45)
    },
    w = Math.random,
    y = {
        x: null,
        y: null,
        max: 2e4
    };
    m.id = l,
    m.style.cssText = "position:fixed;top:0;left:0;z-index:" + d.z + ";opacity:" + d.o,
    e("body")[0].appendChild(m),
    o(),
    window.onresize = o,
    window.onmousemove = function(n) {
        n = n || window.event,
        y.x = n.clientX,
        y.y = n.clientY
    },
    window.onmouseout = function() {
        y.x = null,
        y.y = null
    };
    for (var s = [], f = 0; d.n > f; f++) 
    {
        var h = w() * a,
        g = w() * c,
        v = 2 * w() - 1,
        p = 2 * w() - 1;
        s.push({
            x: h,
            y: g,
            xa: v,
            ya: p,
            max: 6e3
        })
    }
    u = s.concat([y]),
    setTimeout(function() {
        i()
    },
    100)
} ();