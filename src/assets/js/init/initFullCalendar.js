
var number = 6;

if ('undefined' !== typeof module) {
	var numid;
	module.exports = function initFullCalendar() {

		var initialLocaleCode = 'fr',
			$calendar = $('#fullCalendar');
		var Urlserveur = 'http://localhost:8000/v1/';
		//var Urlserveur = 'http://10.241.109.230:8000/v1/';

		today = new Date();
		y = today.getFullYear();
		m = today.getMonth();
		d = today.getDate();

		$calendar.fullCalendar({

			viewRender: function (view, element) {
				// We make sure that we activate the perfect scrollbar when the view isn't on Month
				if (view.name != 'month') {
					$(element).find('.fc-scroller').perfectScrollbar();
				}
			},

			header: {
				left: 'title',
				center: 'month,agendaWeek,agendaDay,listWeek',
				right: 'prev,next,today'
			},
			defaultDate: today,
			locale: initialLocaleCode,
			selectable: true,
			selectHelper: true,
			eventDurationEditable: false,
			eventStartEditable: false,
			timeFormat: 'H(:mm)',

			views: {
				month: { // name of view
					titleFormat: 'MMMM YYYY'
					// other view-specific options here
				},
				week: {
					titleFormat: " MMMM D YYYY"
				},
				Day: {
					titleFormat: 'D MMM, YYYY'
				},

				listWeek: {
					//buttonText: 'Reservations List'
				},
			},

			/*select: function (start, end) {
			 // on select we show the Sweet Alert modal with an input
			 swal({
			 title: 'Create an Event',
			 html: '<div class="form-group">' +
			 '<input class="form-control" placeholder="Event Title" id="input-field">' +
			 '</div>',
			 showCancelButton: true,
			 confirmButtonClass: 'btn btn-success',
			 cancelButtonClass: 'btn btn-danger',
			 buttonsStyling: false
			 }).then(function (result) {

			 var eventData;
			 event_title = $('#input-field').val();

			 if (event_title) {
			 eventData = {
			 title: event_title,
			 start: start,
			 end: end
			 };
			 $calendar.fullCalendar('renderEvent', eventData, true); // stick? = true
			 }

			 $calendar.fullCalendar('unselect');

			 });
			 },*/

			select: function (start, end, jsEvent, view, resource) {
				//console.log("start time "+ start.format('MMMM Do YYYY, h:mm:ss a'));

				console.log(
					'select', start.format("DD-MM-YYYY"), end.format("DD-MM-YYYY"),
					resource ? resource.id : '(no resource)'
				);
				document.forms['myModal'].reset();
				/** Changed by wefa 15-03 **/
				var startDate = start.format("DD-MM-YYYY");
				var endDate = end.format("DD-MM-YYYY");
				$('#AddnewEvent').data("start",startDate).modal({
				//$('#AddnewEvent').data("start",startDate.substr(8) + "-" + startDate.substr(5, 2) + "-" + startDate.substr(0, 4)).modal({
				//$('#simpleRes').data("start",startDate.substr(8) + "-" + startDate.substr(5, 2) + "-" + startDate.substr(0, 4)).modal({
					backdrop: 'static',
					keyboard: false
				});
				$('#AddnewEvent').data("enddate",endDate);
				// To do : add also start time and and time selected


			},

			editable: true,
			eventLimit: true, // allow "more" link when too many events


			/*dayClick: function(date, allDay, jsEvent, view) {
			 //var dateFormat = new DateFormat("MMMM D YYYY H:mm");
			 //var str = dateFormat.format(date); // Date to String

			 var allDayParam;
			 if (allDay) {
			 //alert('Clicked on the entire day: ' + str);
			 allDayParam = 1;
			 }else{
			 //alert('Clicked on the slot: ' + str);
			 allDayParam = 0;
			 }

			 var url = "./calendar/addform.html";
			 $.ajax({
			 //type: 'POST',
			 url: url,
			 data: {
			 allday: allDayParam,
			 //dateTm: str
			 },
			 dataType: 'html',
			 success: function(data) {
			 $('#editdialog').html(data);
			 },
			 error:function() {
			 alert('Error occur');
			 }
			 });

			 $( "#editdialog" ).dialog( "open" );
			 },*/


			/*resourceAreaWidth: '35%',
			 resourceColumns: [

			 {
			 group: true,
			 labelText: 'Building',
			 field: 'building'
			 },

			 {
			 labelText: 'Room',
			 field: 'title'
			 },
			 {
			 labelText: 'capacity',
			 field: 'capacity'
			 }
			 ],*/

			events: {
				url: Urlserveur + 'reservation/allEvents',
				type: 'GET',
				data: {

				},
				error: function () {
					alert('Échec de chargement des réservations salles depuis le serveur');
				}
			},
			resources: {
				url: Urlserveur + 'room/allResources',
				type: 'GET',
				data: {},
				error: function () {
					alert('Échec de chargement des ressources depuis le serveur.');
				}
			},

			eventRender: function (event, element) {
				element.qtip({
					content: "Reservée par " + event.reservedBy,
					style: {
						classes: 'qtip-dark'
					}
				});
			},

			eventClick: function (event, calEvent, jsEvent, view) {
				var startDateFormat = event.startDate.substr(8)+"-"+event.startDate.substr(5,2)+"-"+event.startDate.substr(0,4);
				var endDateFormat = event.endDate.substr(8)+"-"+event.endDate.substr(5,2)+"-"+event.endDate.substr(0,4);
				// console.log(event);
				if (event.type == "public" && event.mailReservedBy != window.localStorage.getItem("currentUserName")) {
					$('#titleUser').html(""+event.description);
					$('#descUser').html("Réservée par : "+event.reservedBy);
					
					$('#roomTitle').html(event.title);
					$('#sd').html(startDateFormat);
					$('#ed').html(endDateFormat); 
					$('#st').html(event.startTime);
					$('#et').html(event.endTime);
					$('#inf').modal(); 
				}

				if (event.mailReservedBy == window.localStorage.getItem("currentUserName")) {
					$('#title').html(event.title);
					$('#sdate').html(startDateFormat);
					$('#edate').html(endDateFormat);
					$('#stime').html(event.startTime);
					$('#etime').html(event.endTime);
					numid = event.id;
					sessionStorage.setItem("resId", event.id);
					$('#num').val(event.id);

					if (event.simple == true) {
						sessionStorage.setItem("periodicity", "simple");
						p = "simple";
						$('#nameSupd').html(event.description);
						$('#starttimesud').val(event.startTime);
						$('#endtimesupd').val(event.endTime);
						$('#startsupd').val(startDateFormat);
						$('input[name="roomselected"][value="' + event.title + '"]').prop('checked', true);
					} else if (event.daily == true) {
						$('#namedupd').html(event.description);
						sessionStorage.setItem("periodicity", "daily");
						p = "daily";
					} else if (event.weekly == true) {
						sessionStorage.setItem("periodicity", "weekly");
						p = "weekly";
					} else if (event.monthly == true) {
						sessionStorage.setItem("periodicity", "monthly");
						p = "monthly";
					} else if (event.yearly == true) {
						sessionStorage.setItem("periodicity", "yearly");
						p = "yearly";
					}
					$('#descRs').html(event.description + " " + "(" + sessionStorage.getItem("periodicity") + " " + "reservation" + ")");
					$('#txt').val(p);
					$('#info').modal();

				}

			},
			eventAfterAllRender: function (view) {
				alert('all events are rendered'); // remove your loading 
			},

			schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives'
		});



	}
}
