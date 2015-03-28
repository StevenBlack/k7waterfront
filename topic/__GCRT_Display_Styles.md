---
layout: topic
permalink: "/topic/__GCRT_Display_Styles/"
title: "__GCRT_Display_Styles"

---

<style>
.insertedit {display:none;}
.large {line-height:1.5em;}
.roundCorners { -moz-border-radius: 8px/*{cornerRadius}*/; -webkit-border-radius: 8px/*{cornerRadius}*/; border-radius: 8px/*{cornerRadius}*/; }
</style>
<script type="text/javascript">
jQuery.fn.vjustify=function() {
    var maxHeight=0;
    this.each(function(){
        if (this.offsetHeight>maxHeight) {maxHeight=this.offsetHeight;}
    });
    this.each(function(){
        $(this).height(maxHeight + "px");
        if (this.offsetHeight>maxHeight) {
            $(this).height((maxHeight-(this.offsetHeight-maxHeight))+"px");
        }
    });
};

$(function(){
 $(".box").vjustify();
});
</script>

