---
layout: post
title: "DataTables Pagination with Twitter Bootstrap"
author: Michael Minter
date: 2013-02-11
comments: true
tags: ['jQuery','Bootstrap','DataTables', Twitter]
thumbnail: https://images.unsplash.com/photo-1512331455279-c8ae8178f586?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWFnaWMlMjBib29rfGVufDB8MHwwfHx8Mg%3D%3D
---

As a developer who likes to spend more time with beautiful object-oriented code rather than mark-up, <a href="http://datatables.net" target="_blank">DataTables</a> is a wonderful tool for me, with a growing list of extendable features.

<!--more-->

> DataTables operates on the principle of progressive enhancement, whereby an enhanced and interactive table will be presented to the end user if their browser has the required capabilities.

One <a href="http://datatables.net/plug-ins/pagination" target="_blank">plug-in</a> that I found will allow your browser to render the default pagination with tags that are designed to work with the popular responsive grid framework: <a href="http://twitter.github.com/bootstrap" target="_blank">Twitter Bootstrap</a>.

<img src="/images/posts/pagination.png" alt="DataTables Pagination with Twitter Bootstrap Design Inteegration" width="100%" />

``` javascript
<!-- more information at: http://www.datatables.net/download/ -->
<script type="text/javascript" src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.9.1.js"></script>
<script type="text/javascript" src="http://ajax.aspnetcdn.com/ajax/jquery.dataTables/1.9.4/jquery.dataTables.js"></script>
<script type="text/javascript">
  /* API method to get paging information */
  $.fn.dataTableExt.oApi.fnPagingInfo = function ( oSettings )
  {
      return {
          "iStart":         oSettings._iDisplayStart,
          "iEnd":           oSettings.fnDisplayEnd(),
          "iLength":        oSettings._iDisplayLength,
          "iTotal":         oSettings.fnRecordsTotal(),
          "iFilteredTotal": oSettings.fnRecordsDisplay(),
          "iPage":          oSettings._iDisplayLength === -1 ?
              0 : Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
          "iTotalPages":    oSettings._iDisplayLength === -1 ?
              0 : Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
      };
  }

  /* Bootstrap style pagination control */
  $.extend( $.fn.dataTableExt.oPagination, {
      "bootstrap": {
          "fnInit": function( oSettings, nPaging, fnDraw ) {
              var oLang = oSettings.oLanguage.oPaginate;
              var fnClickHandler = function ( e ) {
                  e.preventDefault();
                  if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
                      fnDraw( oSettings );
                  }
              };

              $(nPaging).addClass('pagination').append(
                  '<ul>'+
                      '<li class="prev disabled"><a href="#">&larr; '+oLang.sPrevious+'</a></li>'+
                      '<li class="next disabled"><a href="#">'+oLang.sNext+' &rarr; </a></li>'+
                  '</ul>'
              );
              var els = $('a', nPaging);
              $(els[0]).bind( 'click.DT', { action: "previous" }, fnClickHandler );
              $(els[1]).bind( 'click.DT', { action: "next" }, fnClickHandler );
          },

          "fnUpdate": function ( oSettings, fnDraw ) {
              var iListLength = 5;
              var oPaging = oSettings.oInstance.fnPagingInfo();
              var an = oSettings.aanFeatures.p;
              var i, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

              if ( oPaging.iTotalPages < iListLength) {
                  iStart = 1;
                  iEnd = oPaging.iTotalPages;
              }
              else if ( oPaging.iPage <= iHalf ) {
                  iStart = 1;
                  iEnd = iListLength;
              } else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
                  iStart = oPaging.iTotalPages - iListLength + 1;
                  iEnd = oPaging.iTotalPages;
              } else {
                  iStart = oPaging.iPage - iHalf + 1;
                  iEnd = iStart + iListLength - 1;
              }

              for ( i=0, iLen=an.length ; i<iLen ; i++ ) {
                  // Remove the middle elements
                  $('li:gt(0)', an[i]).filter(':not(:last)').remove();

                  // Add the new list items and their event handlers
                  for ( j=iStart ; j<=iEnd ; j++ ) {
                      sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
                      $('<li '+sClass+'><a href="#">'+j+'</a></li>')
                          .insertBefore( $('li:last', an[i])[0] )
                          .bind('click', function (e) {
                              e.preventDefault();
                              oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
                              fnDraw( oSettings );
                          } );
                  }

                  // Add / remove disabled classes from the static elements
                  if ( oPaging.iPage === 0 ) {
                      $('li:first', an[i]).addClass('disabled');
                  } else {
                      $('li:first', an[i]).removeClass('disabled');
                  }

                  if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
                      $('li:last', an[i]).addClass('disabled');
                  } else {
                      $('li:last', an[i]).removeClass('disabled');
                  }
              }
          }
      }
  } );

  var oTable = $('.data-table').dataTable({
    "iDisplayStart": 10,
    "aLengthMenu": [[10, 50, 100, -1], [10, 50, 100, 'All']],
    "sPaginationType": "bootstrap"
  });
</script>
```

Now, just set up your table with a class of __data-table__ and you'll have a paginated controller that comfortably fits the rest of the application's design flow.

DataTables, is an open source project. You can fork its code <a href="https://github.com/DataTables/DataTables" target="_blank">by clicking here</a>.
