---
layout: topic
permalink: "/topic/LocalShipTraffic/"
title: "Local Ship Traffic"

---

## In near real-time
Hover or click on a vessel for more information.

<div id="localShiptraffic"></div>

<script type="text/javascript">
$(function() {
$("#localShiptraffic").html(
  '<iframe name="marinetraffic" id="marinetraffic"'
  + ' width="950"'
  + ' height="500"'
  + ' scrolling="no" frameborder="1"'
  + ' src="http://www.marinetraffic.com/ais/embed.aspx?'
  + 'zoom=10'
  + '&'+'am'+'p;centery=44.210'
  + '&'+'am'+'p;centerx=-76.5012'
  + '&'+'am'+'p;notation=true'
  + '&'+'am'+'p;mmsi=0">Browser does not support IFRAME. Visit directly <a href="http://www.marinetraffic.com/ais/">www.marinetraffic.com</a></iframe>');});</script>

