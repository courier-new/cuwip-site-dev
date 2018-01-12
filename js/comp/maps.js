/**
 * maps.js
 *
 * Controls rendering and interaction with maps around agenda and faq
 *
 * @author    Kelli Rockwell <kellirockwell@mail.com>
 * @since     File available since December 10th, 2017
 * @version   1.0.0
 */

const pomMap = "../img/pom-map-2000.jpg",
      hmcMap = "../img/hmc-map-2000.jpg",
      cppMap = "../img/cpp-map-2000.jpg";


      const addMap = ({
         'event': event,
         'campus': campus
      }) => {
         return ``;
         let mapbg;
         switch(campus) {
            case "Pomona":
            mapbg = pomMap;
            break;
            case "Harvey Mudd":
            mapbg = hmcMap;
            break;
            default:
            mapbg = cppMap;
         }
         return `
         <h4>Location</h4>
         <div class='map block'>
         <img class='map image' src='${mapbg}' />
         <div class='location pin hover area' style='top: 30%; left: 40%;'>
         <div class='wrapper'>
         <div class='shadow'></div>
         <div class='pin'></div>
         <div class="icon"></div>
         </div>
         </div>

         </div>`;
      };
