/**
 * maps.js
 *
 * Controls rendering and interaction with maps around agenda and faq
 *
 * @author    Kelli Rockwell <kellirockwell@mail.com>
 * @since     File available since December 10th, 2017
 * @version   1.0.0
 */

const addMap = ({
    'event': event,
    'campus': campus
}) => {
  return `<div class='map'>${campus}</div>`;
};
