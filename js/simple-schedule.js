'use strict';

const schedule = (selector, opt = {}) => {
    const leftTermSvgText = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">' +
        '<path d="M0 0 L10 10 0 10 Z" style="fill:black"/></svg>';
    const rightTermSvgText = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">' +
        '<path d="M10 10 L0 10 10 0 Z" style="fill:black"/></svg>';
    const topOffsetPx = 25; // Equals height of date labels.
    const $scheduleDiv = $(selector);
    const scheduleInfo = opt.schedule_info;
    // Draw grids and date labels.
    const drawGrid = (step, dashStep, labels) => {
        const width = $scheduleDiv.width();
        const height = $scheduleDiv.height() - topOffsetPx;
        for (let x = 0, lineCount = 0; x < width; x += step, lineCount++) {
            const $gridDiv = $('<div />').appendTo($scheduleDiv);
            const gridCss = {left: x, top: `${topOffsetPx}px`, width: 1, height:height, border: '0.5px gray solid',
                position: 'absolute', 'z-index': 0};
            $gridDiv.css(gridCss);
            // Draw solid and dashed lines alternately.
            if (lineCount % dashStep !== 0) {
                $gridDiv.css('border-style', 'dashed');
            } else {
                const $dateDiv = $('<div />').appendTo($scheduleDiv);
                const dateCss = {left: x, top: 0, position: 'absolute', 'z-index': 0, color: 'black'};
                $dateDiv.css(dateCss);
                $dateDiv.text(labels.shift());
            }
        }
    };
    // Draw schedules.
    if (scheduleInfo !== undefined) {
        const rowGap = 50;
        const hourMillis = 1000 * 3600;
        const dateCursor = new Date(opt.period_from);
        const fromDate = new Date(opt.period_from);
        const toDate = new Date(opt.period_to);
        const dateLabels = [];
        // Date labels on background.
        while (dateCursor <= toDate) {
            dateLabels.push(`${dateCursor.getMonth()+1}/${dateCursor.getDate()}`);
            dateCursor.setDate(dateCursor.getDate() + 1);
        }
        // Draw schedule bars.
        const hourWidth = ($scheduleDiv.width()/dateLabels.length)/24;
        $scheduleDiv.height(scheduleInfo.length * rowGap);
        $(scheduleInfo).each(function (idx, elm) {
            const startDate = new Date(elm.start_date);
            const endDate = new Date(elm.end_date);
            // Area to be clicked for each schedule bar.
            const $rowDiv = $(`<div class="periods" id="period_${elm.id}"/>`).appendTo($scheduleDiv);
            const rowCss = {left: 0, top: `${topOffsetPx+idx*rowGap}px`, width: $scheduleDiv.width(), height: '30px', position: 'absolute', 'z-index': 1, cursor: 'pointer'};
            $rowDiv.css(rowCss);
            $rowDiv.data({id: elm.id, target_type: elm.target_type});
            // Draw icon, title, bar of schedules.
            const left = (startDate >= fromDate) ? Math.floor((startDate.getTime() - fromDate.getTime()) / hourMillis) * hourWidth : 0;
            const width = endDate <= toDate ?
                Math.floor((endDate.getTime() - startDate.getTime()) / hourMillis) * hourWidth : $scheduleDiv.width() - left;
            const $iconSpan = $('<span />').appendTo($rowDiv);
            let iconClasses = 'icon_span glyphicon glyphicon-time';
            if (elm.status[0] === 'ok') {
                iconClasses = 'icon_span glyphicon glyphicon-ok-circle text-success';
            } else if(elm.status[0] === 'ng') {
                iconClasses = 'icon_span glyphicon glyphicon-alert text-danger';
            }
            $iconSpan.addClass(iconClasses);
            const iconCss = {left: left, float: 'left'};
            $iconSpan.css(iconCss);
            const $statusSpan = $('<span />').appendTo($rowDiv);
            const statusCss = {left: left, 'margin-left': '1em', position: 'relative'};
            $statusSpan.css(statusCss);
            $statusSpan.text(`${elm.status_label}`);
            $statusSpan.addClass('status_span');
            const $titleSpan = $('<span />').appendTo($rowDiv);
            const titleCss = {left: left, 'margin-left': '1em', position: 'relative'};
            $titleSpan.css(titleCss);
            $titleSpan.text(`${elm.target_type_label} ${elm.id}/${elm.title}`);
            $titleSpan.addClass('title_span');
            const $barDiv = $('<div />').appendTo($rowDiv);
            const barCss = {background: 'black', left: left, width: width, height: '5px', position: 'relative'};
            $barDiv.css(barCss);
            if (startDate >= fromDate && startDate < toDate) {
                const $svg = $(leftTermSvgText).appendTo($barDiv);
                $svg.css({top: -5, left: 0, position: 'absolute'});
            }
            if (endDate >= fromDate && endDate < toDate) {
                const $svg = $(rightTermSvgText).appendTo($barDiv);
                $svg.css({top: -5, right: 0, position: 'absolute'});
            }
        });
        // Draw background(grids and date labels).
        drawGrid($scheduleDiv.width()/(dateLabels.length * 2), 2, dateLabels);
    }
};
