import { Component, forwardRef, Inject, OnInit, AfterViewInit, ElementRef, NgZone, ViewChild} from '@angular/core';

import { CalendarService } from './calendar.service';

import { CaracsService } from './services/caracs.service';
import { User } from "../user/user";
import { Collab } from "../user/collab";
import { Reservation } from "./models/reservation";
import { WeeklyRes } from "./models/weeklyRes"

import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { Room } from "../room/models/room";
import { Day } from "./models/day";
import { VisibilityType } from "./models/visibilitytype";
import { TypeReservation } from "./models/typereservation";
import DateTimeFormat = Intl.DateTimeFormat;
import { ReservationService } from "./services/reservation.service";
import { error, isNullOrUndefined, isUndefined } from "util";
import { AppComponent } from "../../app.component";
import { NewReservation } from "./models/newReservation";

import { Configuration } from "../../app.constants";
import { TranslateService } from "ng2-translate";

import { DataTablesModule } from 'angular-datatables';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs/Subject';

import {RoomCalendarService } from '../../room-calendar.service';
import * as jQuery from 'jquery';


declare let $: any;

declare var require: any;

const swal = require('../../../assets/js/plugins/sweetalert2.min.js');
//const initDataTable = require('../../../assets/js/init/initDataTable.js');
//const initFullCalendar = require('../../../assets/js/init/initFullCalendar.js');
const initDatetimepickers = require('../../../assets/js/init/initDatetimepickers.js');

// declare var initDataTable: any;
// declare var initFullCalendar: any;
// declare var initDatetimepickers: any;
// declare var swal: any;


import "fullcalendar";

@Component({
    moduleId: module.id,
    selector: 'calendar-cmp',
    providers: [CalendarService, CaracsService, ReservationService, Configuration],
    templateUrl: 'calendarRoom.component.html',
	styleUrls: ['calendar.component.css']
	})

export class CalendarRoomComponent implements AfterViewInit {

	
	calendarElement: any;
	
	public query = '';
	
    reservation: NewReservation = new NewReservation();
	
	startDateTmp : Date;
	endDateTmp : Date;
	
    weeklyRes: WeeklyRes = new WeeklyRes();


    UrlServise: string;
    message: string = "kjqkdqsdqjk";
    id: number;
    num: number;
    newReservation: Reservation = new Reservation();

    updReservation: Reservation = new Reservation();
    user: User = new User();

    rooms: Room[];
    selectedRoom: Room = new Room();
    selectedRoomIsvalide: boolean = false;
    meetingRoom: Room = new Room();

    days: Day[];
    selectedDays: Day[];
    day: Day = new Day();
    previousStartTime: String;
    previousEndTime: String;
    vtypes: VisibilityType[];
    selectedV: VisibilityType = new VisibilityType();
    vtype: VisibilityType = new VisibilityType();

    types: TypeReservation[];
    selectedType: TypeReservation = new TypeReservation();
    type: TypeReservation = new TypeReservation();

    collabs: Collab[];
    selectedCollab: Collab[];
    selectedCollabobli: Collab[];
    selectedCollabString: String = "";
    collab: Collab = new Collab();
    favoriteRooms: Room[];
    choiceenddate: number;
    numberoc: number;
    dt: Date;

    nb: number;
    eventPeriodicity: string;
    eventPeriodname: string;

    formSimple: any = {};
    formDaily: any = {};
    formMonthly: any = {};
    formWeekly: any = {};
    formYearly: any = {};
 private alive: boolean = true;
    name: string;
    start: Date;
    end: Date;
    resourceId: number;
    color: string;
    endDatedaily: Date;

    emails: string;
    errorEmailInvited: boolean = false;
    calendarRefreshed: boolean = true;
	
	dtOptions: DataTables.Settings = {};

	@ViewChild(DataTableDirective)
	dtElement: DataTableDirective;
	
	dtTrigger: Subject<any> = new Subject();
			  
    constructor(private roomCalendarService: RoomCalendarService, private calendarService: CalendarService, private caracsService: CaracsService, private config: Configuration,
        private reservationService: ReservationService, @Inject(Router) private router: Router, private translate: TranslateService,
        @Inject(forwardRef(() => AppComponent)) private _parent: AppComponent, private elRef:ElementRef, private zone: NgZone) {

        this.UrlServise = config.ServerWithApiUrl;
        this._parent.showSideBar = true;

		this.user.mail = window.localStorage.getItem("currentUserName");
        this.user.name = window.localStorage.getItem("nameUser");
		
        /* this.reservationService.getListRoom().subscribe(
            data => {
                this.rooms = JSON.parse(JSON.parse(JSON.stringify(data))._body);
                //initDataTable();
            },
            error => { console.log(error) },
        ); */
    this.calendarService.getFavoriteCalendars().subscribe(data => {
            this.favoriteRooms  = JSON.parse(data['_body']);
        this.initCalendar();
        }, error => { console.log('got favorite cal error ' + error); });
        this.reservationService.getListDays().subscribe(
            data => {
                this.days = JSON.parse(JSON.parse(JSON.stringify(data))._body);
            },
            error => { console.log(error) },
        );

        this.reservationService.getListCollabs().subscribe(
            data => {
                this.collabs = JSON.parse(JSON.parse(JSON.stringify(data))._body);
            },
            error => { console.log(error) },
        );

        this.caracsService.getListVisibility().subscribe(
            data => {
                this.vtypes = JSON.parse(JSON.parse(JSON.stringify(data))._body);
                if (this.vtypes.length != 0) {
                    this.newReservation.visibilitytyperes = this.vtypes[0];
                }
            },
            error => { console.log(error) },
        );

        this.caracsService.getListType().subscribe(
            data => {
                this.types = JSON.parse(JSON.parse(JSON.stringify(data))._body);
                if (this.types.length != 0) {
                    this.newReservation.typeres = this.types[0];
                }
            },
            error => { console.log(error) },
        );


        this.selectedCollab = [];
        this.selectedCollabobli = [];
        this.selectedDays = [];
        this.emails = "";
		
		$.getScript('../../../assets/js/plugins/jquery.qtip.js');
		$.getScript('../../../assets/js/plugins/bootstrap-datetimepicker.js');
		
		this.elRef = $('#fullCalendarLang');
		
    }

    ngOnInit(): void {
    this.dtOptions = {
		language: {
							"url": this.translate.currentLang === "en" ? "assets/i18n/datatables-en.json"
								: "assets/i18n/datatables-fr.json",
							search: "_INPUT_",
							searchPlaceholder: "Search rooms",
						},
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        // Unbind first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        $('td', row).unbind('click');
        $('td', row).bind('click', () => {
		  let index = this.findIndexRoomByName(data[1]);
		  if (index >= 0)
			this.clickRow(index);

        });
        return row;
      }
    };
        this.updateData();
  }
	findIndexRoomByName(roomName)
  {
	for(let i = 0; i < this.rooms.length; i++)
		  if(this.rooms[i].name == roomName)
			  return i;
	return -1;
		  
  }
    
    updateData() {
        this.roomCalendarService.onToggleIdentifier().takeWhile(() => this.alive).subscribe(reload => {
            this.favoriteRooms = reload; 
            this.rerenderFullCalendar();
        });
    }
      ngOnDestroy() {
        this.alive = false;
    }

    ngAfterViewInit() {
		
		this.calendarElement = $('#fullCalendar');

        
        var self = this;


        
				            setTimeout(() => {

        $('.modal').appendTo("body");
		}, 500);
        $.getScript('../../../assets/js/plugins/jquery.tagsinput.js');

        if ($(".selectpicker").length != 0) {
            setTimeout(() => {
                $('.selectpicker').selectpicker('refresh');
            }, 150);

			
			 $("#selected-date-range").bind('change', function(event) {
      alert( $("#selected-date-range").attr("value") );
	  
	  
	  this.observer = new MutationObserver(mutations => {
      mutations.forEach(function(mutation) {
      });   
    });
    var config = { attributes: true, childList: true, characterData: true };

    this.observer.observe(this.elRef.nativeElement, config);
	
	
    
    
	
   });
			

        }

        initDatetimepickers();
        this.router.navigate['/login'];
        $("#start").on('dp.change', function (e) {
	
            self.newReservation.startdate = $("#start").val();
            let start = new Date(self.newReservation.startdate.substr(6, 4) + "-" + self.newReservation.startdate.substr(3, 2) + "-" + self.newReservation.startdate.substr(0, 2));
            let end = new Date(self.newReservation.enddate.substr(6, 4) + "-" + self.newReservation.enddate.substr(3, 2) + "-" + self.newReservation.enddate.substr(0, 2));
            if (start > end) {
                self.newReservation.enddate = $("#start").val();
                self.newReservation.reccurenceenddate = $("#start").val();
                $("#enddate").val(self.newReservation.enddate);
                $("#reccurenceenddateperio").val(self.newReservation.enddate);
            }
        });
        $("#startdateperio").on('dp.change', function (e) {
            self.newReservation.startdate = $("#startdateperio").val();
            let start = new Date(self.newReservation.startdate.substr(6, 4) + "-" + self.newReservation.startdate.substr(3, 2) + "-" + self.newReservation.startdate.substr(0, 2));
            let end = new Date(self.newReservation.enddate.substr(6, 4) + "-" + self.newReservation.enddate.substr(3, 2) + "-" + self.newReservation.enddate.substr(0, 2));
            if (start > end) {
                self.newReservation.enddate = $("#startdateperio").val();
                self.newReservation.reccurenceenddate = $("#startdateperio").val();
                $("#enddate").val(self.newReservation.enddate);
                $("#reccurenceenddateperio").val(self.newReservation.enddate);
            }
        });
        $("#enddate").on('dp.change', function (e) {
            self.newReservation.enddate = $("#enddate").val();
            // var dt = $("#end").val();
            var start = new Date(self.newReservation.startdate.substr(6, 4) + "-" + self.newReservation.startdate.substr(3, 2) + "-" + self.newReservation.startdate.substr(0, 2));
            let end = new Date(self.newReservation.enddate.substr(6, 4) + "-" + self.newReservation.enddate.substr(3, 2) + "-" + self.newReservation.enddate.substr(0, 2));
            if (start > end) {
                self.newReservation.enddate = $("#start").val();
                self.newReservation.reccurenceenddate = $("#start").val();
                $("#enddate").val(self.newReservation.enddate);
                $("#reccurenceenddateperio").val(self.newReservation.enddate);
            }
            // else {
            //     self.newReservation.enddate = $("#end").val();
            // }
        });
        $("#reccurenceenddateperio").on('dp.change', function (e) {
            self.newReservation.enddate = $("#reccurenceenddateperio").val();
            self.newReservation.reccurenceenddate = $("#reccurenceenddateperio").val();
            let start = new Date(self.newReservation.startdate.substr(6, 4) + "-" + self.newReservation.startdate.substr(3, 2) + "-" + self.newReservation.startdate.substr(0, 2));
            let end = new Date(self.newReservation.enddate.substr(6, 4) + "-" + self.newReservation.enddate.substr(3, 2) + "-" + self.newReservation.enddate.substr(0, 2));
            if (start > end) {
                self.newReservation.reccurenceenddate = $("#start").val();
                self.newReservation.enddate = $("#start").val();
                $("#enddate").val(self.newReservation.enddate);
                $("#reccurenceenddateperio").val(self.newReservation.enddate);
            }
        });
        $("#starttime").on('dp.change', function (e) {
            self.newReservation.starttime = $("#starttime").val();
        });
        $("#endtime").on('dp.change', function (e) {
            self.newReservation.endtime = $("#endtime").val();
        });
        $("#starttimeperio").on('dp.change', function (e) {
            self.newReservation.starttime = $("#starttimeperio").val();
        });
        $("#endtimeperio").on('dp.change', function (e) {
            self.newReservation.endtime = $("#endtimeperio").val();
        });
        $("#startDatedaily").on('dp.change', function (e) {
            self.newReservation.startdate = $("#startDatedaily").val();
            let start = new Date(self.newReservation.startdate.substr(6, 4) + "-" + self.newReservation.startdate.substr(3, 2) + "-" + self.newReservation.startdate.substr(0, 2));
            let end = new Date(self.newReservation.reccurenceenddate.substr(6, 4) + "-" + self.newReservation.reccurenceenddate.substr(3, 2) + "-" + self.newReservation.reccurenceenddate.substr(0, 2));
            if (start > end) {
                self.newReservation.reccurenceenddate = $("#startDatedaily").val();
            }
        });
        $("#starttimedaily").on('dp.change', function (e) {
            self.newReservation.starttime = $("#starttimedaily").val();
        });
        $("#endtimedaily").on('dp.change', function (e) {
            self.newReservation.endtime = $("#endtimedaily").val();
        });
        $("#reccurenceenddate").on('dp.change', function (e) {
            self.newReservation.reccurenceenddate = $("#reccurenceenddate").val();
            let start = new Date(self.newReservation.startdate.substr(6, 4) + "-" + self.newReservation.startdate.substr(3, 2) + "-" + self.newReservation.startdate.substr(0, 2));
            let end = new Date(self.newReservation.reccurenceenddate.substr(6, 4) + "-" + self.newReservation.reccurenceenddate.substr(3, 2) + "-" + self.newReservation.reccurenceenddate.substr(0, 2));
            if (start > end) {
                self.newReservation.reccurenceenddate = $("#startDatedaily").val();
            }
        });

        $("#startDateweekly").on('dp.change', function (e) {
            self.newReservation.startdate = $("#startDateweekly").val();
            let start = new Date(self.newReservation.startdate.substr(6, 4) + "-" + self.newReservation.startdate.substr(3, 2) + "-" + self.newReservation.startdate.substr(0, 2));
            let end = new Date(self.newReservation.reccurenceenddate.substr(6, 4) + "-" + self.newReservation.reccurenceenddate.substr(3, 2) + "-" + self.newReservation.reccurenceenddate.substr(0, 2));
            if (start > end) {
                self.newReservation.reccurenceenddate = $("#startDateweekly").val();
            }
        });
        $("#starttimeweekly").on('dp.change', function (e) {
            self.newReservation.starttime = $("#starttimeweekly").val();
        });
        $("#endtimeweekly").on('dp.change', function (e) {
            self.newReservation.endtime = $("#endtimeweekly").val();
        });
        $("#reccurenceenddateweekly").on('dp.change', function (e) {
            var dt = $("#reccurenceenddateweekly").val();
            var start = new Date(self.newReservation.startdate.substr(6, 4) + "-" + self.newReservation.startdate.substr(3, 2) + "-" + self.newReservation.startdate.substr(0, 2));
            var end = new Date(dt.substr(6, 4) + "-" + dt.substr(3, 2) + "-" + dt.substr(0, 2));
            if (start > end) {
                self.newReservation.reccurenceenddate = $("#startDateweekly").val();
                $("#reccurenceenddateweekly").val(self.newReservation.reccurenceenddate);
            } else {
                self.newReservation.reccurenceenddate = $("#reccurenceenddateweekly").val();
            }
        });

        $("#startDatemonthly").on('dp.change', function (e) {
            self.newReservation.startdate = $("#startDatemonthly").val();
            let start = new Date(self.newReservation.startdate.substr(6, 4) + "-" + self.newReservation.startdate.substr(3, 2) + "-" + self.newReservation.startdate.substr(0, 2));
            let end = new Date(self.newReservation.reccurenceenddate.substr(6, 4) + "-" + self.newReservation.reccurenceenddate.substr(3, 2) + "-" + self.newReservation.reccurenceenddate.substr(0, 2));
            if (start > end) {
                self.newReservation.reccurenceenddate = $("#startDatemonthly").val();
            }
        });
        $("#starttimemonthly").on('dp.change', function (e) {
            self.newReservation.starttime = $("#starttimemonthly").val();
        });
        $("#endtimemonthly").on('dp.change', function (e) {
            self.newReservation.endtime = $("#endtimemonthly").val();
        });
        $("#reccurenceenddatemonthly").on('dp.change', function (e) {
            var dt = $("#reccurenceenddatemonthly").val();
            var start = new Date(self.newReservation.startdate.substr(6, 4) + "-" + self.newReservation.startdate.substr(3, 2) + "-" + self.newReservation.startdate.substr(0, 2));
            var end = new Date(dt.substr(6, 4) + "-" + dt.substr(3, 2) + "-" + dt.substr(0, 2));
            if (start > end) {
                self.newReservation.reccurenceenddate = $("#startDatemonthly").val();
                $("#reccurenceenddatemonthly").val(self.newReservation.reccurenceenddate);
            } else {
                self.newReservation.reccurenceenddate = $("#reccurenceenddatemonthly").val();
            }
        });

        $("#startDateyearly").on('dp.change', function (e) {
            self.newReservation.startdate = $("#startDateyearly").val();
            let start = new Date(self.newReservation.startdate.substr(6, 4) + "-" + self.newReservation.startdate.substr(3, 2) + "-" + self.newReservation.startdate.substr(0, 2));
            let end = new Date(self.newReservation.reccurenceenddate.substr(6, 4) + "-" + self.newReservation.reccurenceenddate.substr(3, 2) + "-" + self.newReservation.reccurenceenddate.substr(0, 2));
            if (start > end) {
                self.newReservation.reccurenceenddate = $("#startDateyearly").val();
            }
        });
        $("#starttimeyearly").on('dp.change', function (e) {
            self.newReservation.starttime = $("#starttimeyearly").val();
        });
        $("#endtimeyearly").on('dp.change', function (e) {
            self.newReservation.endtime = $("#endtimeyearly").val();
        });
        $("#reccurenceenddateyearly").on('dp.change', function (e) {
            var dt = $("#reccurenceenddateyearly").val();
            var start = new Date(self.newReservation.startdate.substr(6, 4) + "-" + self.newReservation.startdate.substr(3, 2) + "-" + self.newReservation.startdate.substr(0, 2));
            var end = new Date(dt.substr(6, 4) + "-" + dt.substr(3, 2) + "-" + dt.substr(0, 2));
            if (start > end) {
                self.newReservation.reccurenceenddate = $("#startDateyearly").val();
                $("#reccurenceenddateyearly").val(self.newReservation.reccurenceenddate);
            } else {
                self.newReservation.reccurenceenddate = $("#reccurenceenddateyearly").val();
            }
        });

        //this.calVal='fr';
        /*$(document).ready(function() {
            $('#fullCalendar').fullCalendar('option', 'locale', this.calVal);
        });*/
        // console.log(this.message);
		this.dtTrigger.next();
    }

    /*  simple reservation*/
	initCalendar()
	{
		let numid;
        
		var initialLocaleCode = 'fr',
			$calendar = $('#fullCalendar');
		var Urlserveur = this.UrlServise;
		//var Urlserveur = 'http://10.241.109.230:8000/v1/';

		let today = new Date();
		let y = today.getFullYear();
		let m = today.getMonth();
		let d = today.getDate();
		let p;
         let listRooms = [];
        for( let i = 0 ; i < this.favoriteRooms.length; i++) {
             listRooms.push(this.favoriteRooms[i].name);
            }
		this.calendarElement.fullCalendar({

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
             weekends: false,
            minTime: "08:00:00",
            maxTime:"20:00:00",
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


			select: function (start, end, jsEvent, view, resource) {


				this.startDateTmp = start.format("DD-MM-YYYY");
				this.endDateTmp = end.format("DD-MM-YYYY");
                 let startTime = start.format("hh:mm");
                let endTime = end.format("hh:mm");
                if(start['_i'][3] > 12)
                {
                    startTime = startTime.replace(startTime.slice(0,2),start['_i'][3]);
                    
                 }
                if(end['_i'][3] > 12)
                {
                    endTime = endTime.replace(endTime.slice(0,2),end['_i'][3]);
                    
                    }
                $('#AddnewEvent').modal();
                $('#AddnewEvent').data("start",this.startDateTmp);
                $('#AddnewEvent').data("enddate",this.endDateTmp);
                $('#AddnewEvent').data("startTime", startTime);
                $('#AddnewEvent').data("endTime", endTime);

			},

			editable: true,
			eventLimit: true, // allow "more" link when too many events
            
			events: {
				url: Urlserveur + '/reservation/allEventsByRoom?listroom='+listRooms,
				type: 'GET',
				data: {

				},
				cache: true,
				error: function () {
					alert('Echec de chargement des réservations salles depuis le serveur');
				},
				success: function (data) {
                    // data will have your json array of event objects
                },
			},
			 resources: {
				url: Urlserveur + '/room/allrooms',
				type: 'GET',
				data: {},
				error: function () {
					alert('Ã‰chec de chargement des ressources depuis le serveur.');
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
					$('#descUser').html("Reservée par : "+event.reservedBy);
					
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
					console.log("event"+ event.id);
					sessionStorage.setItem("resId", event.id);
					$('#num').val(event.id);
					console.log("event"+ $('#num').val());

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
				//alert('all events are rendered'); // remove your loading 
			},

			schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives'
		});



	



	
		
		
		
	}
    rerenderFullCalendar() {
		this.calendarRefreshed = false;
        let listRooms = [];
        for( let i = 0 ; i < this.favoriteRooms.length; i++) {
             listRooms.push(this.favoriteRooms[i].name);
            }
		console.log("allEvents");
        this.calendarElement.fullCalendar('removeEventSources');
		setTimeout(() => {
		this.calendarElement.fullCalendar('addEventSource', { "url": this.UrlServise + '/reservation/allEventsByRoom?listroom='+listRooms});

		this.calendarRefreshed = true;
		}, 100);

    }
	
	
	FilterFullCalendarByRooms() {
		if (this.query != "")
		{
			this.calendarRefreshed = false;

			//this.calendarElement.fullCalendar('removeEvents');


			this.calendarElement.fullCalendar('removeEventSources');
			setTimeout(() => {
			this.calendarElement.fullCalendar('addEventSource', { "url": this.UrlServise + '/reservation/allEventsByRoom?listroom=' + this.query});

			this.calendarRefreshed = true;
			}, 100);
		}
		else
		{
			this.calendarRefreshed = false;
			this.calendarElement.fullCalendar('removeEventSources');
			setTimeout(() => {
			this.calendarElement.fullCalendar('addEventSource', { "url": this.UrlServise + '/reservation/allEvents'});

			this.calendarRefreshed = true;
			}, 100);
		}
    }
	
    validateEmail(email) {
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailReg.test(email);
    }

    onSubmitPeriodicite() {
        var valide_email = true;
        console.log(this.newReservation);
        if (this.newReservation.invited != undefined && this.newReservation.invited != "") {
            var emails = this.newReservation.invited.split(";");
            for (var i = 0; i < emails.length; i++) {
                if (!this.validateEmail(emails[i])) {
                    valide_email = false;
                    break;
                }
            }
            if (!valide_email) {
                this.errorEmailInvited = true;
            }
        }
        if (valide_email) {
            // $('#simpleRes').hide();
            $('#simpleRes').modal('toggle');

            switch (this.newReservation.typereservation) {
                case "simple":
                    this.onSubmitSimple();
                    break;
                case "daily":
                    this.onSubmitDaily();
                    break;
                case "weekly":
                    this.onSubmitWeekly();
                    break;
                case "monthly":
                    this.onSubmitMonthly();
                    break;
                case "yearly":
                    this.onSubmitYearly();
                    break;
            }
        }
    }

    onSubmitSimple() {
        this.user.mail = window.localStorage.getItem("currentUserName");
        this.user.name = window.localStorage.getItem("nameUser");
        //this.newReservation.enddate = this.newReservation.startdate;
        this.newReservation.allday = false;
        this.newReservation.simple = true;
        this.newReservation.daily = false;
        this.newReservation.weekly = false;
        this.newReservation.monthly = false;
        this.newReservation.yearly = false;
        this.newReservation.room = this.selectedRoom;
        this.reservation.collabs = this.selectedCollab;
        this.newReservation.stateres = true;
        this.reservation.reservation = this.newReservation;
        this.reservation.user = this.user;
        if (!this.newReservation.description) {
            this.newReservation.description = " ";
        }
        console.log(this.reservation);
        this.reservationService.sendSimpleReservation(this.reservation).subscribe(
            data => {
                this.message = JSON.stringify(data.text());
                // console.log(this.message);
                swal({
                    title: this.newReservation.title,
                    text: this.message === '"Conflits !"' ? "Echec de réservation" : "Réservation ajoutée avec succès ",
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-info",
                    animation: false,
                    customClass: 'animated tada'
                }).then(() => {
                    var url = this.UrlServise;
                    document.forms['formSimple'].reset();
                    document.forms['parts'].reset();
                    document.forms['rooms'].reset();
                    this.selectedType = this.types.length > 0 ? this.types[0] : new TypeReservation();
                    this.selectedV = this.vtypes.length > 0 ? this.vtypes[0] : new VisibilityType();
                    this.selectedCollab = []
                    this.selectedRoom.action = false;
                    this.selectedRoomIsvalide = false;
                    this.rerenderFullCalendar();

                })
            },
            error => {
                document.forms['formSimple'].reset();
                document.forms['parts'].reset();
                document.forms['rooms'].reset();
                this.selectedType = this.types.length > 0 ? this.types[0] : new TypeReservation();
                this.selectedV = this.vtypes.length > 0 ? this.vtypes[0] : new VisibilityType();
                this.selectedCollab = []
                this.selectedRoom.action = false;
                this.selectedRoomIsvalide = false;
                // console.log(error)
            },
        )

    }
    // DateStart: any;
    // starttime: any;
    // endtime: any;
    onSelectionRoomChange(meetingRoom) {
		//console.log("res"+JSON.stringify(meetingRoom));
        if (!this.newReservation.startdate || !this.newReservation.starttime || !this.newReservation.endtime) {
            swal({
                title: "Erreur",
                text: "Vous devez choisir la date et le créneau de réservation",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-warning",
            }).then(() => {
                $('input[name="roomselected"]').prop('checked', false);
            })
            return;
        }
        this.selectedRoom = Object.assign({}, this.selectedRoom, meetingRoom);

        this.newReservation.room = this.selectedRoom;

	    this.selectedRoomIsvalide = true;

    }

    onSelectionCollabChange(collb, event) {
        var cbIdx = this.selectedCollab.indexOf(collb);
        if (event.target.checked) {
            if (cbIdx < 0)
                this.selectedCollab.push(collb);
        } else {
            if (cbIdx >= 0)
                this.selectedCollab.splice(cbIdx, 1);
			var cbnIdx = this.selectedCollabobli.indexOf(collb);
			if(cbnIdx >= 0)
				this.selectedCollabobli.splice(cbnIdx, 1);
			
        }

    }

    onSelectionCollabObliChange(collb, event) {
        var cbIdx = this.selectedCollabobli.indexOf(collb);
        if (event.target.checked) {
            if (cbIdx < 0)
                this.selectedCollabobli.push(collb);
			var cbnIdx = this.selectedCollab.indexOf(collb);
			if (cbnIdx < 0)
				this.selectedCollab.push(collb);
        } else {
            if (cbIdx >= 0)
                this.selectedCollabobli.splice(cbIdx, 1);
        }
    }

    onUpdateRoomChange(meetingRoom) {
        this.selectedRoom = Object.assign({}, this.selectedRoom, meetingRoom);
        var sdt = $('#startsupd').data('date');
        var stm = $('#starttimesud').data('date');
        var etm = $('#endtimesupd').data('date');
        this.newReservation.startdate = sdt;
        this.newReservation.starttime = stm;
        this.newReservation.enddate = sdt;
        this.newReservation.endtime = etm;
        this.newReservation.room = this.selectedRoom;
    }
resetRoom(){
    if(this.previousStartTime != this.newReservation.starttime ||  this.previousEndTime != this.newReservation.endtime){ 
                this.selectedRoom.name = undefined;
        this.previousStartTime = this.newReservation.starttime;
        this.previousEndTime = this.newReservation.endtime;
        
        }

    }
    /* daily reservation */

    onSubmitDaily() {
        this.user.mail = window.localStorage.getItem("currentUserName");
        this.user.name = sessionStorage.getItem("nameUser");
        this.newReservation.enddate = this.newReservation.enddate;
        if (this.newReservation.dailyenddate === "radioend") {
            this.endDatedaily = $('#textdate').data('date');
            this.newReservation.enddate = this.newReservation.reccurenceenddate;
            this.newReservation.reccurenceNumber = 0;
        } else if (this.newReservation.dailyenddate === "noend") {
            this.newReservation.enddate = undefined;
            this.newReservation.reccurenceNumber = 0;
        }
        this.newReservation.allday = false;
        this.newReservation.simple = false;
        this.newReservation.daily = true;
        this.newReservation.weekly = false;
        this.newReservation.monthly = false;
        this.newReservation.yearly = false;
        this.newReservation.room = this.selectedRoom;
        this.reservation.collabs = this.selectedCollab;
        this.newReservation.stateres = true;
        this.reservation.reservation = this.newReservation;
        this.reservation.user = this.user;
        if (!this.newReservation.description) {
            this.newReservation.description = " ";
        }
		let days: string[] =[];
		let msg : string = '';
        this.reservationService.sendDailyReservation(this.reservation).subscribe(
            data => {
				days = data.json();
				for(let d in days)
				{
					msg += days[d]+', ';
				}
				if( days.length >0 )
				{
					msg = msg.substring(0, msg.length -2 );
					if(days.length > 1){
					msg = 'les jours '+ msg + ' ne sont pas reservés';
					}else { msg = 'le jour '+ msg + ' n\'est pas reservé'; }
				}
                swal({
                    title: this.newReservation.title,
                    text:  "Réservation ajoutée avec succès" + msg ,
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-info",
                    animation: false,
                    customClass: 'animated tada'
                }).then(() => {
                    this.rerenderFullCalendar();
                    var url = this.UrlServise;
                    document.forms['formDaily'].reset();
                    document.forms['parts'].reset();
                    document.forms['parts'].reset();
                    this.selectedType = this.types.length > 0 ? this.types[0] : new TypeReservation();
                    this.selectedV = this.vtypes.length > 0 ? this.vtypes[0] : new VisibilityType();
                    this.selectedCollab = []
                    this.selectedRoom.action = false;
                    this.selectedRoomIsvalide = false;

                })
            },
            error => {
                var url = this.UrlServise;
                document.forms['formDaily'].reset();
                document.forms['parts'].reset();
                document.forms['parts'].reset();
                this.selectedType = this.types.length > 0 ? this.types[0] : new TypeReservation();
                this.selectedV = this.vtypes.length > 0 ? this.vtypes[0] : new VisibilityType();
                this.selectedCollab = []
                this.selectedRoom.action = false;
                this.selectedRoomIsvalide = false;
            }
        );

    };

    onSelectionRoomChangeDaily(meetingRoom) {
        if (!this.newReservation.startdate || !this.newReservation.starttime || !this.newReservation.endtime) {
            swal({
                title: "Erreur",
                text: "Vous devez choisir la date et le créneau de réservation",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-warning",
            }).then(() => {
                $('input[name="roomselected"]').prop('checked', false);
            })
            return;
        }
        this.selectedRoom = Object.assign({}, this.selectedRoom, meetingRoom);
        var sdt = this.newReservation.startdate;
        // var stm = this.newReservation.starttime;
        // var etm = this.newReservation.endtime;


        // this.newReservation.startdate = sdt;
        // this.newReservation.starttime = stm;
        this.newReservation.enddate = sdt;
        // this.newReservation.endtime = etm; 
        this.newReservation.room = this.selectedRoom;

    }

    onSelectChoice(choice) {
        if (choice == 'textdate') {
            this.numberoc = 0;
            this.newReservation.reccurenceNumber = 0;
            this.choiceenddate = 3;
        }
        else if (choice == 'numberrecc') {
            // this.numberoc = $('#numberrecc');

            this.choiceenddate = 2;
        }
        else if (choice == "noend") {
            this.numberoc = 0;
            this.newReservation.reccurenceNumber = 0;
            this.choiceenddate = 1;
        }
        else if (choice == "radioocur") {
            $('#radioocur').focus();
        }
        else if (choice == "radioend") {
            $('#radioend').focus();

        }
    }

    /* weekly reservation */

    onSubmitWeekly() {
        this.user.mail = window.localStorage.getItem("currentUserName");
        this.user.name = sessionStorage.getItem("nameUser");

        if (this.newReservation.dailyenddate === "radioend") {
            this.newReservation.enddate = this.newReservation.reccurenceenddate;
            this.newReservation.reccurenceNumber = 0;
        } else if (this.newReservation.dailyenddate === "noend") {
            this.newReservation.enddate = undefined;
            this.newReservation.reccurenceNumber = 0;
        }
       
        this.newReservation.allday = false;
        this.newReservation.simple = false;
        this.newReservation.daily = false;
        this.newReservation.weekly = true;
        this.newReservation.monthly = false;
        this.newReservation.yearly = false;
        this.newReservation.room = this.selectedRoom;
        this.reservation.collabs = this.selectedCollab;
        this.newReservation.stateres = true;

        this.weeklyRes.selected = this.selectedDays;
        this.weeklyRes.reservation = this.newReservation;

        this.reservation.weeklyRes = this.weeklyRes;
        this.reservation.user = this.user;
        if (!this.newReservation.description) {
            this.newReservation.description = " ";
        }
		let days: string[] =[];
		let msg : string = '';
        this.reservationService.sendWeeklyReservation(this.reservation).subscribe(
            data => {
                this.message = JSON.stringify(data.text());
				days = data.json();
				for(let d in days)
				{
					console.log(d);
					console.log(days[d]);
					msg += days[d]+', ';
				}
				if( days.length >0 )
				{
					msg = msg.substring(0, msg.length -2 );
					if(days.length > 1){
					msg = 'les jours '+ msg + ' ne sont pas reservés';
					}else { msg = 'le jour '+ msg + ' n\'est pas reservé'; }
				}
                swal({
                    title: this.newReservation.title,
                    text: "Réservation ajoutée avec succès " + msg ,
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-info",
                    animation: false,
                    customClass: 'animated tada'
                }).then(() => {
                    var url = this.UrlServise;
                    document.forms['formWeekly'].reset();
                    document.forms['parts'].reset();
                    document.forms['parts'].reset();
                    this.selectedType = this.types.length > 0 ? this.types[0] : new TypeReservation();
                    this.selectedV = this.vtypes.length > 0 ? this.vtypes[0] : new VisibilityType();
                    this.selectedCollab = [];
                    this.selectedDays = [];
                    this.selectedRoom.action = false;
                    this.selectedRoomIsvalide = false;
                    this.rerenderFullCalendar();

                })
            },
            error => {
                var url = this.UrlServise;
                document.forms['formWeekly'].reset();
                document.forms['parts'].reset();
                document.forms['parts'].reset();
                this.selectedType = this.types.length > 0 ? this.types[0] : new TypeReservation();
                this.selectedV = this.vtypes.length > 0 ? this.vtypes[0] : new VisibilityType();
                this.selectedCollab = [];
                this.selectedDays = [];
                this.selectedRoom.action = false;
                this.selectedRoomIsvalide = false;
            }
        );

    };

    onSelectedDays(day, event) {
        var cbIdx = this.selectedDays.indexOf(day);
        if (event.target.checked) {
            if (cbIdx < 0)
                this.selectedDays.push(day);
        } else {
            if (cbIdx >= 0)
                this.selectedDays.splice(cbIdx, 1);
        }
    }

    checkJoursEntiereChange(event) {
        this.newReservation.jourEntiere = event.target.checked;
        if (!event.target.checked) {
            var hours = new Date().getHours();
            this.newReservation.starttime = hours < 10 ? '0' + hours + ':00' : hours + ':00';
            this.newReservation.endtime = (hours + 1) > 23 ? "00:00" :
                (hours + 1) < 10 ? '0' + (hours + 1) + ':00' : (hours + 1) + ':00';

        } else {
            this.newReservation.starttime = "08:00";
            this.newReservation.endtime = "18:00";
        }

    }
	checkAcceptConflict(event) {
		this.newReservation.acceptConflict = event.target.checked;
	}
    invitedParticipant(invited: boolean) {
        this.newReservation.invitePartisipans = invited;
    }
    selectchoixParaticipants() {
        var self = this;
        setTimeout(function () {
            $('#listCollabsper').DataTable(
                {
                    "pagingType": "simple_numbers",
                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                    responsive: true,
                    language: {
                        "url": self.translate.currentLang === "en" ? "http://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/English.json"
                            : "http://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/French.json",
                        search: "_INPUT_",
                        searchPlaceholder: "Search here",
                    }
                }
            );
        }, 20);
        this.clickp();
    }

    choixInvitedListes() {
        this.errorEmailInvited = false;
    }

    selectchoixsalles() {
		
		//$('#tableroomsper').empty();
	this.newReservation.daysList = this.selectedDays ;
				  switch (this.newReservation.typereservation) {
                case "simple":
					this.newReservation.simple = true;
					this.newReservation.daily = false ;
					this.newReservation.weekly = false ;
					this.newReservation.monthly = false ;
					this.newReservation.yearly = false ;
					
                    break;
                case "daily":
                    this.newReservation.daily = true;
					this.newReservation.weekly = false ;
					this.newReservation.monthly = false ;
					this.newReservation.yearly = false ;
					this.newReservation.simple = false;
					
                    break;
                case "weekly":
                   this.newReservation.weekly = true;
				   this.newReservation.monthly = false ;
					this.newReservation.yearly = false ;
					this.newReservation.simple = false;
					this.newReservation.daily = false ;
                    break;
                case "monthly":
                   	this.newReservation.dayofweek = this.newReservation.monthdayof == "dayofweek";
					this.newReservation.dayofmonth = this.newReservation.monthdayof == "dayofmonth";
					this.newReservation.monthly = true;
					this.newReservation.yearly = false ;
					this.newReservation.simple = false;
					this.newReservation.daily = false ;
					this.newReservation.weekly = false ;
                    break;
                case "yearly":
                    this.newReservation.yearly = true;
				    this.newReservation.simple = false;
					this.newReservation.daily = false ;
					this.newReservation.weekly = false ;
					this.newReservation.monthly = false ;
				   break;
				   default:
				    console.log("Invalid choice"); 
					break;      
				  }
				  											
         this.reservationService.listofroomnotconflit(this.newReservation).subscribe(data => {
			//this.rooms = [];
            this.rooms = JSON.parse(JSON.parse(JSON.stringify(data))._body);
			//this.dtTrigger.next();

			this.rerender();
        },
            error => {
				this.rooms = [];		
            })		

       
        this.click();
    }



    onSelectionRoomChangeWeekly(meetingRoom) {
        if (!this.newReservation.startdate || !this.newReservation.starttime || !this.newReservation.endtime) {
            swal({
                title: "Erreur",
                text: "Vous devez choisir la date et le créneau de réservation",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-warning",
            }).then(() => {
                $('input[name="roomselected"]').prop('checked', false);
            })
            return;
        }
        this.selectedRoom = Object.assign({}, this.selectedRoom, meetingRoom);
        var sdt = this.newReservation.startdate;
        // var stm = this.newReservation.starttime;
        // var etm = this.newReservation.endtime;


        // this.newReservation.startdate = sdt;
        // this.newReservation.starttime = stm;
        this.newReservation.enddate = sdt;
        // this.newReservation.endtime = etm; 
        this.newReservation.room = this.selectedRoom;
    }

    onSelectChoiceWeeklyEnd(choice) {
        if (choice == 'textdate2') {
            this.numberoc = 0;
        }
        else if (choice == 'numberrecc2') {
            // this.numberoc = $('#numberrecc');
            this.choiceenddate = 2;
        }
        else if (choice == "noend2") {
            this.numberoc = 0;
            this.choiceenddate = 1;
        }
        else if (choice == "radioocur2") {
            $('#radioocur').focus();
        }
        else if (choice == "radioend2") {
            this.choiceenddate = 3;
            $('#radioend').focus();
        }
    }

    /* monthly reservation */

    onSubmitMonthly() {
        this.user.mail = window.localStorage.getItem("currentUserName");
        this.user.name = sessionStorage.getItem("nameUser");

        if (this.newReservation.dailyenddate === "radioend") {
            this.newReservation.enddate = this.newReservation.reccurenceenddate;
            this.newReservation.reccurenceNumber = 0;
        } else if (this.newReservation.dailyenddate === "noend") {
            this.newReservation.enddate = undefined;
            this.newReservation.reccurenceNumber = 0;
        }
       
        this.newReservation.allday = false;
        this.newReservation.simple = false;
        this.newReservation.daily = false;
        this.newReservation.weekly = false;
        this.newReservation.monthly = true;
        this.newReservation.yearly = false;
        this.newReservation.room = this.selectedRoom;
        this.reservation.collabs = this.selectedCollab;
        this.newReservation.stateres = true;
        this.newReservation.dayofweek = this.newReservation.monthdayof == "dayofweek";
        this.newReservation.dayofmonth = this.newReservation.monthdayof == "dayofmonth";

        this.reservation.reservation = this.newReservation;
        this.reservation.user = this.user;

        if (!this.newReservation.description) {
            this.newReservation.description = " ";
        }
		let days: string[] =[];
		let msg : string = '';
        this.reservationService.sendMonthlyReservation(this.reservation).subscribe(
            data => {
				days = data.json();
				for(let d in days)
				{

					msg += days[d]+', ';
				}
				if( days.length >0 )
				{
					msg = msg.substring(0, msg.length -2 );
					if(days.length > 1){
					msg = 'les jours '+ msg + ' ne sont pas reservés';
					}else { msg = 'le jour '+ msg + ' n\'est pas reservé'; }
				}
                swal({
                    title: this.newReservation.title,
                    text: "Réservation ajoutée avec succès" + msg ,
                    buttonsStyling: false,
                    confirmButtonClass: "btn btn-info",
                    animation: false,
                    customClass: 'animated tada'
                }).then(() => {
                    var url = this.UrlServise;
                    document.forms['formMonthly'].reset();
                    document.forms['parts'].reset();
                    document.forms['parts'].reset();
                    this.selectedType = this.types.length > 0 ? this.types[0] : new TypeReservation();
                    this.selectedV = this.vtypes.length > 0 ? this.vtypes[0] : new VisibilityType();
                    this.selectedCollab = [];
                    this.selectedRoom.action = false;
                    this.selectedRoomIsvalide = false;
                    this.rerenderFullCalendar();
                })
            },
            error => {
                var url = this.UrlServise;
                document.forms['formMonthly'].reset();
                document.forms['parts'].reset();
                document.forms['parts'].reset();
                this.selectedType = this.types.length > 0 ? this.types[0] : new TypeReservation();
                this.selectedV = this.vtypes.length > 0 ? this.vtypes[0] : new VisibilityType();
                this.selectedCollab = [];
                this.selectedRoom.action = false;
                this.selectedRoomIsvalide = false;
            }
        );
    };

    onSelectionRoomChangeMonthly(meetingRoom) {
        if (!this.newReservation.startdate || !this.newReservation.starttime || !this.newReservation.endtime) {
            swal({
                title: "Erreur",
                text: "Vous devez choisir la date et le créneau de réservation",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-warning",
            }).then(() => {
                $('input[name="roomselected"]').prop('checked', false);
            })
            return;
        }
        this.selectedRoom = Object.assign({}, this.selectedRoom, meetingRoom);
        var sdt = this.newReservation.startdate;
        this.newReservation.enddate = sdt;
        this.newReservation.room = this.selectedRoom;

    }

    onSelectChoiceMonthlyEnd(choice) {

        if (choice == 'textdate1') {
            this.numberoc = 0;
            this.choiceenddate = 3;

        }
        else if (choice == 'numberrecc1') {
            // this.numberoc = $('#numberrecc');
            this.choiceenddate = 2;
        }
        else if (choice == "noend1") {
            this.numberoc = 0;
            this.choiceenddate = 1;
        }
        else if (choice == "radioocur1") {
            $('#radioocur').focus();
        }
        else if (choice == "radioend1") {
            $('#radioend').focus();
            this.choiceenddate = 3;
        }
    }

    onSelectChoiceDay(choice) {

        if (choice == 'dayofweek') {
            this.newReservation.dayofweek = true;
            this.newReservation.dayofmonth = false;

        }
        else if (choice == 'dayofmonth') {
            this.newReservation.dayofweek = false;
            this.newReservation.dayofmonth = true;
        }
    }

    /*  yearly reservation */

    onSubmitYearly() {

        this.user.mail = window.localStorage.getItem("currentUserName");
        this.user.name = sessionStorage.getItem("nameUser");

        if (this.newReservation.dailyenddate === "radioend") {
            this.newReservation.enddate = this.newReservation.reccurenceenddate;
            this.newReservation.reccurenceNumber = 0;
        } else if (this.newReservation.dailyenddate === "noend") {
            this.newReservation.enddate = undefined;
            this.newReservation.reccurenceNumber = 0;
        }
        else {
            this.newReservation.enddate = undefined;
        }
        this.newReservation.allday = false;
        this.newReservation.simple = false;
        this.newReservation.daily = false;
        this.newReservation.weekly = false;
        this.newReservation.monthly = false;
        this.newReservation.yearly = true;
        this.newReservation.room = this.selectedRoom;
        this.reservation.collabs = this.selectedCollab;
        this.newReservation.stateres = true;

        this.reservation.reservation = this.newReservation;
        this.reservation.user = this.user;

        if (!this.newReservation.description) {
            this.newReservation.description = " ";
        }
        /*
    this.reservationService.sendYearlyReservation(this.reservation).subscribe(
        data => {
            this.message = JSON.stringify(data.text());
            // console.log(this.message);
            swal({
                title: this.newReservation.title,
                text: this.message,
                buttonsStyling: false,
                confirmButtonClass: "btn btn-info",
                animation: false,
                customClass: 'animated tada'
            }).then(() => {
                document.forms['formYearly'].reset();
                //var events : {"url" : 'http://localhost:8000/v1/reservation/allEvents'};
                $('#fullCalendar').fullCalendar('removeEvents');
                $('#fullCalendar').fullCalendar('addEventSource', { "url": this.UrlServise + '/reservation/allEvents' });
                $('#fullCalendar').fullCalendar('rerenderEvents');

                this.router.navigate(['/calendar']).catch(error => console.log(error));

            })
        },
        error => console.log(error)
    );*/
    };

    onSelectionRoomChangeYearly(meetingRoom) {
        if (!this.newReservation.startdate || !this.newReservation.starttime || !this.newReservation.endtime) {
            swal({
                title: "Erreur",
                text: "Vous devez choisir la date et le créneau de réservation",
                buttonsStyling: false,
                confirmButtonClass: "btn btn-warning",
            }).then(() => {
                $('input[name="roomselected"]').prop('checked', false);
            })
            return;
        }
        this.selectedRoom = Object.assign({}, this.selectedRoom, meetingRoom);
        var sdt = this.newReservation.startdate;
        this.newReservation.enddate = sdt;
        this.newReservation.room = this.selectedRoom;

    }

    onSelectChoiceYearlyEnd(choice) {

        if (choice == 'textdate3') {
            this.numberoc = 0;
            this.choiceenddate = 3;

        }
        else if (choice == 'numberrecc3') {
            //this.numberoc = $('#numberrecc3');
            this.choiceenddate = 2;
        }
        else if (choice == "noend3") {
            this.numberoc = 0;
            this.choiceenddate = 1;
        }
        else if (choice == "radioocur3") {
            $('#radioocur').focus();
        }
        else if (choice == "radioend3") {
            $('#radioend').focus();
            this.choiceenddate = 3;

        }
    }

    /*     */

    onReset() {
        //document.forms['form1'].reset();

    }



    deleteEvent() {
		console.log("num"+$('#num').val());
        this.id = parseInt($('#num').val());
		console.log("id"+this.id);

		swal({
		title: "Voulez vous supprimer cette réservation ?",
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Ok',
		cancelButtonText: 'Annuler',
		confirmButtonClass: 'btn btn-primary',
		cancelButtonClass: 'btn btn-warning',
		buttonsStyling: false
        }).then((result) => {
		  if (result) {
			this.calendarService.deleteEv(this.id).subscribe(
            data => {
				$('#calendar').fullCalendar('removeEvents', this.id);
				this.rerenderFullCalendar();
			},
            error => console.log(error),
			);
		  }
		});
    };

    /*  update  reservation */
    updateEvent() {

        this.id = parseInt(sessionStorage.getItem("resId"));
        var p = sessionStorage.getItem("periodicity");
        // console.log(p);

        if (p == "simple") {

            $('#simpleResUpd').appendTo("body");
            $('#simpleResUpd').modal();

            this.reservationService.getReservation(this.id).subscribe(
                data => {
                    this.updReservation = JSON.parse((JSON.stringify(data)));
                    // console.log(this.updReservation);
                },
                error => { console.log(error) },
            );

        }
        else if (p == "daily") {

            $('#dailyResUpd').appendTo("body");
            $('#dailyResUpd').modal();
        }
        else if (p == "monthly") {

        }
        else if (p = "weekly") {

        }
        else if (p == "yearly") {

        }
    }

    update() {

        this.updReservation.startdate = $('#startsupd').data('date');
        this.updReservation.enddate = $('#startsupd').data('date');
        this.updReservation.starttime = $('#starttimesud').data('date');
        this.updReservation.endtime = $('#endtimesupd').data('date');
        if (this.selectedRoom.name != '') {
            this.updReservation.room = this.selectedRoom;
        }

        // console.log(this.updReservation.startdate + " " + this.updReservation.starttime + this.updReservation.endtime + this.updReservation.room.name);


    }

    cancelChoixReservation() {
        this.eventPeriodicity = undefined;
    }
    onSelect() {
        // console.log($('input[name=choice]:checked').val() + "--");
        this.eventPeriodname = $('input[name=choice]:checked').val();
        this.translate.get("calendar." + $('input[name=choice]:checked').val()).subscribe((res: string) => {
            this.updateeventname(res);
        });
        this.eventPeriodicity = $('input[name=choice]:checked').val();
        $(':input[type="button"]').prop('disabled', false);
    }
    updateeventname(name) {
        this.eventPeriodname = name;
    }

    isValideFormssimple(): boolean {
        return this.isValidParms(this.newReservation.title) && this.isValidParms(this.newReservation.color)
            && this.isValidParms(this.newReservation.typeres) && this.isValidParms(this.newReservation.visibilitytyperes)
            && this.isValidParms(this.newReservation.startdate) &&
            this.isValidParms(this.newReservation.starttime) &&
            this.isValidParms(this.newReservation.endtime)

    }
    isValidParms(parm): boolean {
        return parm != undefined && parm != null && parm != "";
    }

    onStart() {
		document.forms['parts'].reset();
        document.forms['rooms'].reset();
        let self = this;
        //var my_data = $("#AddnewEvent").data('start');
        var startDate = $("#AddnewEvent").data('start');
        //var startDate = new Date(this.startDateTmp);
        var endDate = $("#AddnewEvent").data('enddate');
        var startTime =  $("#AddnewEvent").data('startTime');
        let endTime = $("#AddnewEvent").data('endTime');
        //var my_data = $("#myModal").data('start');
        // document.forms['formSimple'].reset();
        
        this.selectedCollabString = "";
        this.selectedCollab = []
        this.selectedRoom.action = false;
        this.selectedRoom.name = undefined;
        this.selectedRoomIsvalide = false;
        this.eventPeriodicity = "simple";
        this.eventPeriodname = "simple";
        this.translate.get("calendar." + this.eventPeriodname).subscribe((res: string) => {
            this.updateeventname(res);
        });
        if (this.eventPeriodicity == "simple") {
            
            this.newReservation = new Reservation();
            this.newReservation.typereservation = "simple";
            this.selectedDays = [];
            if (this.days.length > 0)
                this.selectedDays.push(this.days[0]);
            this.newReservation.typeres = this.types.length > 0 ? this.types[0] : new TypeReservation();
            this.newReservation.visibilitytyperes = this.vtypes.length > 0 ? this.vtypes[0] : new VisibilityType();
            // console.log(this.newReservation);
            this.newReservation.startdate = startDate;
            this.newReservation.enddate = startDate;
            this.newReservation.reccurenceenddate = startDate;
          
            this.newReservation.starttime = startTime;
            this.newReservation.endtime = endTime;
              this.previousStartTime = startTime;
            this.previousEndTime = endTime;
            $('#simpleRes').modal({
                backdrop: 'static',
                keyboard: false
            });
        }
        else if (this.eventPeriodicity == "daily") {

            
            this.newReservation = new Reservation();
            this.newReservation.typeres = this.types.length > 0 ? this.types[0] : new TypeReservation();
            this.newReservation.visibilitytyperes = this.vtypes.length > 0 ? this.vtypes[0] : new VisibilityType();
            this.newReservation.startdate = startDate;
            this.newReservation.reccurenceenddate = startDate;
            var hours = new Date().getHours();
            this.newReservation.starttime = hours < 10 ? '0' + hours + ':00' : hours + ':00';
            this.newReservation.endtime = (hours + 1) > 23 ? "00:00" : (hours + 1) < 10 ? '0' + (hours + 1) + ':00' : (hours + 1) + ':00';
            
            
        }
        else if (this.eventPeriodicity == "weekly") {
            
            this.selectedDays = [];
            if (this.days.length > 0)
                this.selectedDays.push(this.days[0]);
            this.newReservation = new Reservation();
            this.newReservation.typeres = this.types.length > 0 ? this.types[0] : new TypeReservation();
            this.newReservation.visibilitytyperes = this.vtypes.length > 0 ? this.vtypes[0] : new VisibilityType();
            this.newReservation.startdate = startDate;
            this.newReservation.reccurenceenddate = startDate;
            var hours = new Date().getHours();
            this.newReservation.starttime = hours < 10 ? '0' + hours + ':00' : hours + ':00';
            this.newReservation.endtime = (hours + 1) > 23 ? "00:00" : (hours + 1) < 10 ? '0' + (hours + 1) + ':00' : (hours + 1) + ':00';
            $('#weeklyRes').modal({
                backdrop: 'static',
                keyboard: false
            });
        }
        else {
            $('#myModal').hide();
        }
    }

    hideModel(name) {
        // console.log(this.newReservation);
        if (name === "periodiciteRes") {
            this.newReservation.typereservation = "simple";
            this.newReservation.enddate = this.newReservation.startdate;
            this.selectedRoom.name = undefined;
        } else if (name === "rooms") {
            this.selectedRoomIsvalide = false;
            this.selectedRoom.name = undefined;
            this.selectedRoom.action = false;
        }
        // $('#' + name).hide();
        $('#' + name).modal('toggle');
    }

    showPeriodicite() {
        this.newReservation.typereservation = this.newReservation.typereservation;
        $('#periodiciteRes').modal({
            backdrop: 'static',
            keyboard: false
        });
    }
    newReservationFromTime(newValue) {
        // console.log(newValue);

    }

    click() {
        $('#rooms').modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    clickp() {
        $('#parts').modal({
            backdrop: 'static',
            keyboard: false
        });
    }
    selectListeParts() {
        this.selectedCollabString = "";
        for (var i = 0; i < this.selectedCollab.length; i++) {
            this.selectedCollabString += this.selectedCollab[i].firstName + ";"
        }

    }
    choixSelectPeriodicite() {
        this.translate.get("calendar." + this.newReservation.typereservation).subscribe((res: string) => {
            this.updateeventname(res);
        });
        this.eventPeriodicity = this.newReservation.typereservation;
        this.selectedRoom.name = undefined;
        $('#periodiciteRes').modal('toggle');
    }
    choixDeletePeriodicite() {
        this.newReservation.typereservation = "simple";
        this.translate.get("calendar." + this.newReservation.typereservation).subscribe((res: string) => {
            this.updateeventname(res);
        });
        this.eventPeriodicity = this.newReservation.typereservation;
        // $('#periodiciteRes').hide();
        $('#periodiciteRes').modal('toggle');

    }
    onSelectChoiceTypeReservation() {
        this.newReservation.frequency = 1;
    }
    
clickRow(index)
	{
		this.newReservation.room.idroom = this.rooms[index].idroom;
		this.onSelectionRoomChange(this.rooms[index]);
	}
	
	rerender() {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
	}
    
	
}
