if ('undefined' !== typeof module) {

    module.exports = function initDataTable() {

        /*setTimeout(function () {$('#listCollabs').DataTable(
            {
                "pagingType": "simple_numbers",
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                responsive: true,
                language: {
                    search: "_INPUT_",
                    searchPlaceholder: "Search here",
                }
            }
        ); }, 1000);*/

        setTimeout(function () {
            $('#datatables').DataTable(
                {
                    "pagingType": "full_numbers",
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    responsive: true,
                    language: {
                        search: "_INPUT_",
                        searchPlaceholder: "Search groups"
                    }
                }
            );
        }, 1000);

        /*console.log(setTimeout(function(){ $('#tablerooms').DataTable(
            {
                "pagingType": "simple_numbers",
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                responsive: true,
                language: {
                    search: "_INPUT_",
                    searchPlaceholder: "Search rooms",
                }
            }
        ); }, 1000));*/

        console.log(setTimeout(function () {
            $('#tableroomsUpd').DataTable(
                {
                    "pagingType": "full_numbers",
                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                    responsive: true,
                    language: {
                        search: "_INPUT_",
                        searchPlaceholder: "Search rooms",
                    }
                }
            );
        }, 20));

        console.log(setTimeout(function () {
            $('#tableroomsdailyupd').DataTable(
                {
                    "pagingType": "full_numbers",
                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                    responsive: true,
                    language: {
                        search: "_INPUT_",
                        searchPlaceholder: "Search rooms",
                    }
                }
            );
        }, 20));

        setTimeout(function () {
            $('#resList').DataTable(
                {
                    "pagingType": "full_numbers",
                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                    responsive: true,
                    language: {
                        search: "_INPUT_",
                        searchPlaceholder: "Search here",
                    }
                }
            );
        }, 1000);

        setTimeout(function () {
            $('#roomLst').DataTable(
                {
                    "pagingType": "full_numbers",
                    "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
                    responsive: true,
                    "language":
                    {
                        search: "_INPUT_",
                        searchPlaceholder: "Search rooms",
                    }
                }
            );
        }, 1000);

        /*
              {
                  "pagingType": "full_numbers",
                  "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                  responsive: true,
                  language: {
                      search: "_INPUT_",
                      searchPlaceholder: "Search rooms",
                  }
              }
          ); }, 1000);
  
          setTimeout(function () {
              $('#listCollabsdaily').DataTable(
              {
                  "pagingType": "full_numbers",
                  "lengthMenu": [[5,10, 25, 50, -1], [5,10, 25, 50, "All"]],
                  responsive: true,
                  language: {
                      search: "_INPUT_",
                      searchPlaceholder: "Search here",
                  }
              }
          );
       }, 1000);*/

        /*    setTimeout(function () {$('#listCollabsmonthly').DataTable(
                {
                    "pagingType": "full_numbers",
                    "lengthMenu": [[5,10, 25, 50, -1], [5,10, 25, 50, "All"]],
                    responsive: true,
                    language: {
                        search: "_INPUT_",
                        searchPlaceholder: "Search here",
                    }
                }
            ); }, 1000);
            setTimeout(function(){ $('#tableroomsmonthly').DataTable(
                {
                    "pagingType": "full_numbers",
                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                    responsive: true,
                    language: {
                        search: "_INPUT_",
                        searchPlaceholder: "Search rooms",
                    }
                }
            ); }, 1000);*/


      /*  setTimeout(function () {
            $('#listCollabsweekly').DataTable(
                {
                    "pagingType": "full_numbers",
                    "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
                    responsive: true,
                    language: {
                        search: "_INPUT_",
                        searchPlaceholder: "Search here",
                    }
                }
            );
        }, 1000);

        setTimeout(function () {
            $('#tableroomsweekly').DataTable(
                {
                    "pagingType": "full_numbers",
                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                    responsive: true,
                    language: {
                        search: "_INPUT_",
                        searchPlaceholder: "Search rooms",
                    }
                }
            );
        }, 1000);*/

      /*  
        setTimeout(function () {
            $('#listCollabsyearly').DataTable(
                {
                    "pagingType": "full_numbers",
                    "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
                    responsive: true,
                    language: {
                        search: "_INPUT_",
                        searchPlaceholder: "Search here",
                    }
                }
            );
        }, 1000);
        setTimeout(function () {
            $('#tableroomsyearly').DataTable(
                {
                    "pagingType": "full_numbers",
                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                    responsive: true,
                    language: {
                        search: "_INPUT_",
                        searchPlaceholder: "Search rooms",
                    }
                }
            );
        }, 1000);*/



        //  Activate the tooltips
        $('[rel="tooltip"]').tooltip();


    }
}
