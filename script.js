function addpicture() {
    var imagelink = gix("imagelink");
    var linkto = gix("linkto");
    clearidvalue("imagelink");
    clearidvalue("linkto");
    var maindiv = document.createElement('div');
    maindiv.className="addpic2";

    var linkinput = document.createElement('input');
    linkinput.type="text";
    linkinput.className="linkinput" ;
    linkinput.value = imagelink ;

    var hrefinput = document.createElement('input');
    hrefinput.type = "text" ;
    hrefinput.value = linkto ;
    hrefinput.className="hrefinput" ;

    var removebtn = document.createElement('input');
    removebtn.type="button";
    removebtn.value = "حذف عکس" ;
    removebtn.onclick= function(){
        //the code to remove div when button clicked
        this.parentNode.parentNode.removeChild(this.parentNode);
    };
    

    var linkofpictxt = document.createElement('label');
    linkofpictxt.innerText="آدرس عکس" ;

    var linktotxt = document.createElement('label');
    linktotxt.innerText = "لینک به آدرس"

    var newlinetxt = document.createElement('br');
	
    maindiv.appendChild(linkofpictxt);
    maindiv.appendChild(linkinput);
    maindiv.appendChild(newlinetxt.cloneNode(true));
    maindiv.appendChild(linktotxt);
    maindiv.appendChild(hrefinput);
    maindiv.appendChild(newlinetxt.cloneNode(true));
    maindiv.appendChild(removebtn);

    document.getElementById("addedpics").appendChild(maindiv);
}
// this function creates the code out of pictures and informations you have entered.
function createcode() {
    clearidvalue("outputtxt");
    var hrefclass = document.getElementsByClassName("hrefinput");
    var imageclass = document.getElementsByClassName("linkinput");
    var piclist = document.getElementsByClassName('addpic2');
    var piccount = piclist.length;
    var sliderid = gix("sliderid");
    var breaktime =gix("breaktime");
    var changetime =gix("changetime");
    var sliderwidth = gix("sliderwidth");
    var sliderheight = gix("sliderheight");
    var sliderradius = gix("sliderradius");
    try {
        if (sliderheight == '' || sliderwidth == '' || sliderid == '' || sliderradius == '' || changetime == '' || breaktime == ''){
            throw "تمامی فیلد های لازم را پر کنید" ;
        } else ;
        if (piccount == 0){
            throw "حداقل یک عکس را اضافه کنید" ;
        }else;
        for (var i = 0; i < imageclass.length ; i++){
            if (imageclass[i].value == '')throw "آدرس تمامی عکس ها را وارد کنید";
        }
    } catch (err){
        alert (err) ;
        return;
    }

    var totaltime = piccount*(parseFloat(breaktime)+parseFloat(changetime)) ; //calculates the whole slider time
    totaltime = parseFloat(totaltime.toFixed(2));
    var ratio = sliderheight / sliderwidth / piccount  * 100 ;
    ratio = ratio.toFixed(2) + "%" ;
    var basecsscode = '#$id {width:100%; max-width: &widthpx; height:auto; margin:0 auto ; overflow: hidden; border-radius: &radiuspx; } .$idclass { width: &classwidth ; position: relative; display: block; animation: $idanimation &fulltimes infinite; animation-play-state: running; } .$idclass:hover { animation-play-state: paused; filter: grayscale(0.5); } .$idclass a span { width:&spanwidth; max-width: &widthpx; height: 0 ; padding-top: &ratio; margin: 0; float: left; background-size: cover; background-repeat: no-repeat; background-position: center;}';
    //this codes below replaces entered values in basecode.
    basecsscode = basecsscode.replace(/\$id/g,sliderid);
    basecsscode = basecsscode.replace(/\&ratio/g,ratio);
    basecsscode = basecsscode.replace(/\&width/g,sliderwidth);
    basecsscode = basecsscode.replace(/\&classwidth/g, 100 * piccount + "%");
    basecsscode = basecsscode.replace(/\&spanwidth/g, Math.floor(100/piccount * 100) / 100 + "%");
    basecsscode = basecsscode.replace(/\&radius/g,sliderradius);
    basecsscode = basecsscode.replace(/\&fullwidth/g,piccount*sliderwidth);
    basecsscode = basecsscode.replace(/\&fulltime/g,totaltime); 
    //we need to convert time into percentage in order to use css animation
    var breaktimedeg = (breaktime*100)/totaltime ;
    var chnagetimedeg = (changetime*100)/totaltime;
    // a simple code to convert long floats to fixed 2 decimal points. (sorry. i havn't learn mathmatics in english!)
    breaktimedeg = Math.floor(breaktimedeg * 1e2) / 1e2 ;
    chnagetimedeg = Math.floor(chnagetimedeg * 1e2) / 1e2 ;
    //live percentage determines what percent we are currently on
    var livepercentage = 0 ;
    // first initiation of code.
    var animationcode = '@keyframes ' + sliderid + 'animation {';
    var counter = 0 ;
    var onpic = 0 ;
    while (counter <= piccount*2) {
        if (counter == 0){
            animationcode = animationcode + '0% {right:0px;}';
            counter ++ ;
        } else ;
        if (counter % 2 == 0) {
            livepercentage += chnagetimedeg;
            livepercentage = parseFloat(livepercentage.toFixed(2));
            animationcode = animationcode + livepercentage + '%{right:' + (onpic*100) +'%;}' ;
            counter ++ ;
        } 
        else if (counter % 2 == 1){
            livepercentage += breaktimedeg;
            livepercentage = parseFloat(livepercentage.toFixed(2));
            animationcode = animationcode + (livepercentage + '%{right:' + (onpic * 100)  + '%;}');
            counter ++ ;
            onpic ++ ;
        }
        if (counter == piccount*2){
            animationcode = animationcode + '100%{right:0%;}';
            animationcode = animationcode + '}' ;
            counter ++ ;
        } else;
    };
    basecsscode += animationcode ;

    //generate html code:
    var basehtmlcode = '<div dir=\"ltr\" id=\"' + sliderid +'\">\n<div class=\"'+sliderid+'class\">';
    for (var counter = 0; counter < piccount ; counter++) {
        basehtmlcode += '\n<a href=\"' + hrefclass[counter].value + '\" target=\"_Blank\">' ;
        basehtmlcode += '\n<span style=\"background-image:url(' + imageclass[counter].value + ');\">&nbsp;</span>';
        basehtmlcode += '\n</a>'
    }
    basehtmlcode += '\n</div></div>';
	var startcredit = '<!-- slider tool by Chortak.Blog.ir -->\n' ;
	var endcredit = '\n<!--end of slider tool by Chortak.Blog.ir -->' ;
    var finalcode = startcredit 
    +'<style>' + basecsscode + '</style>\n' + basehtmlcode 
    + endcredit ;
    document.getElementById("outputtxt").value = finalcode ;
    basehtmlcode = '' ;
    basecsscode = '';
}
// get id and return that id's text from document.
function gix(id) {
    return document.getElementById(id).value ;
}

//clear id's value
function clearidvalue(id) {
    document.getElementById(id).value = "";
}
