/**
 * maps.js
 *
 * Controls rendering and interaction with maps around agenda and faq
 *
 * @author    Kelli Rockwell <kellirockwell@mail.com>
 * @since     File available since December 10th, 2017
 * @version   1.0.0
 */

const pomMap = "../img/pom-map.jpg",
      pomMillikanMap = "../img/pom-millikan.jpg",
      hmcMap = "../img/hmc-map.jpg",
      cppMap = "../img/cpp-parking-map.jpg",
      cppBSCMap = "../img/cpp-bsc.jpg";


      const addMap = (mapType) => {
         let mapbg;
         switch(mapType) {
            case "pom":
            mapbg = pomMap;
            break;
            case "pom-millikan":
            mapbg = pomMillikanMap;
            break;
            case "hmc":
            mapbg = hmcMap;
            break;
            case "cpp-bsc":
            mapbg = cppBSCMap;
            break;
            case "cpp-parking":
            mapbg = cppMap;
            break;
         }
         if (mapbg) {
            return `
            <h4>Map</h4>
            <div class='map block'>
            <a href='${mapbg}'><img class='map image' src='${mapbg}' /></a>
            <p align='center'>
   				<strong><span class='device word capitalized'></span> the map to view it full-sized.</strong>
   			</p>
            <!--<div class='location pin hover area' style='top: 30%; left: 40%;'>
               <div class='wrapper'>
                  <div class='shadow'></div>
                  <div class='pin'></div>
                  <div class="icon"></div>
               </div>
            </div>-->

            </div>`;
         } else {
            return ``;
         }
      };
