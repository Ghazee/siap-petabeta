window.siap = {

   /*
    * Get value of global variable.
    * Return false on invalid identifier, or undefined if no such variable found.
    */
   getGlobalVar: function (varname) {
      return typeof varname == 'string'
          && !!varname.match(/^[a-z_$][0-9a-z_$]*$/i)
          && window[varname];
   },

   /*
    * Load scripts asychronously.
    */
   loadScript: function (src) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      document.getElementsByTagName('head')[0].appendChild(script);
   }

};

( function ( $, window, document, undefined ) {

if ( !window.siap )
   return;

////////////////////////////////////////////////////////////////////////////////////////////////////

window.siap.cascade = function ( parent, child, options ) {
   var initial = true;

   parent = $( typeof parent == 'string' ? '#' + parent : parent );
   child = $( typeof child == 'string' ? '#' + child : child );

   options = $.extend( {
      parentOptions:  [],
      childOptions:   {},
      limitOptions:   [false, false],
      initialOptions: [false, false],
      extraOptions:   [false, false],
      complete:       function () { }
   }, options || {} );

   function initialize() {
      populateParent();
      populateChild();

      parent.change( populateChild );
      child.change( function () { options.complete() } );
   }

   function populateParent() {
      var limitOption = [];
      var limitValue = options.limitOptions[0];
      var initialOption = options.initialOptions[0];
      var initialValue = false;

      parent.empty();

      if ( limitValue ) {
         $.each( options.parentOptions, function () {
            if ( this[0] == limitValue ) {
               limitOption = [this];
               return false;
            }
         } );

         options.parentOptions = limitOption;

      } else if ( options.extraOptions[0] ) {
         parent.append( '<option value="' + options.extraOptions[0][0] + '">'
            + options.extraOptions[0][1] + '</option>' );
      }

      if ( options.parentOptions ) {
         $.each( options.parentOptions, function () {
            parent.append( '<option value="' + this[0] + '">' + this[1] + '</option>' );
            if ( this[0] == initialOption ) initialValue = this[0];
         } );
      }

      if ( initial && initialValue ) {
         parent.val( initialValue );
      }
   }

   function populateChild() {
      var parentValue = parent.val();
      var childOptions = options.childOptions[parentValue];
      var limitOption = [];
      var limitValue = options.limitOptions[1];
      var initialOption = options.initialOptions[1];
      var initialValue = false;

      if ( typeof parentValue != 'string' )
         return;

      child.empty();

      if ( limitValue ) {
         $.each( childOptions, function () {
            if ( this[0] == limitValue ) {
               limitOption = [this];
               return false;
            }
         } );

         childOptions = limitOption;

      } else if ( options.extraOptions[1] ) {
         child.append( '<option value="' + options.extraOptions[1][0] + '">'
            + options.extraOptions[1][1] + '</option>' );
      }

      if ( childOptions ) {
         $.each( childOptions, function () {
            child.append( '<option value="' + this[0] + '">' + this[1] + '</option>' );
            if ( this[0] == initialOption ) initialValue = this[0];
         } );
      }

      if ( initial && initialValue ) {
         child.val( initialValue );
      }
   }

   initialize();
   initial = false;

   return {};

};

////////////////////////////////////////////////////////////////////////////////////////////////////

window.siap.cascade.multi = function ( options ) {
   var initial = true;

   options = $.extend( {
      elements:       [],
      elementOptions: [],
      limitOptions:   [],
      initialOptions: [],
      extraOptions:   [],
      urlOptions:     [],
      complete:       function () { }
   }, options || {} );

   for ( var i = 0; i < options.elements.length; i++ ) {
      options.elements[i] = typeof options.elements[i] == 'string' ?
         $( '#' + options.elements[i] ) : $( options.elements[i] );
   }

   function initialize() {
      changeOption();
      $.each( options.elements, function ( i ) {
         $( this ).change( function () {
            changeOption( i + 1 );
         } );
      } );
   }

   function changeOption( index ) {
      var url, value;

      index = index || 0;

      if ( !options.elements[index] )
         return;

      if ( options.urlOptions[index] ) {
         url = options.urlOptions[index];

         if ( index > 0 ) {
            value = options.elements[index - 1].val();
            url   = url.replace( '{value}', value );
         }

         $.ajax( {
            url      : url,
            dataType : 'json',
            success  : function ( json ) {
               if (! ( json && json.length ))
                  json = [];

               populate( index, json );
            }
         } );

      } else {
         if ( index > 0 ) {
            value = options.elements[index - 1].val();
            populate( index, options.elementOptions[index][value] );
         } else {
            populate( index, options.elementOptions[index] );
         }
      }
   }

   function populate( index, comboOptions ) {
      var combo         = options.elements[index];
      var limitOption   = [];
      var limitValue    = options.limitOptions[index];
      var initialOption = options.initialOptions[index];
      var initialValue  = false;

      combo.empty();

      if ( limitValue ) {
         $.each( comboOptions, function () {
            if ( this[0] == limitValue ) {
               limitOption = [this];
               return false;
            }
         } );

         options.elementOptions = limitOption;

      } else if ( options.extraOptions[index] ) {
         combo.append( '<option value="' + options.extraOptions[index][0] + '">'
            + options.extraOptions[index][1] + '</option>' );
      }

      if ( comboOptions ) {
         $.each( comboOptions, function () {
            combo.append( '<option value="' + this[0] + '">' + this[1] + '</option>' );
            if ( this[0] == initialOption ) initialValue = this[0];
         } );
      }

      if ( initial && initialValue ) {
         combo.val( initialValue );
      }

      changeOption( index + 1 );
   }

   initialize();
   initial = false;

   return {};

};

////////////////////////////////////////////////////////////////////////////////////////////////////

window.siap.cascade.indonesian = function ( parent, child, options ) {
   return window.siap.cascade( parent, child, $.extend( {
      parentOptions: siap.master.propinsi,
      childOptions:  siap.master.kota
   }, options || {} ) );
};

////////////////////////////////////////////////////////////////////////////////////////////////////

} )( jQuery, window, window.document );

( function ( window ) {

if ( !window.siap )
   return;

window.siap.master = {};

} )( window );

( function ( window ) {

if ( !window.siap )
   return;

if ( !window.siap.master )
   return;

////////////////////////////////////////////////////////////////////////////////////////////////////

window.siap.master.propinsi = [
   [100,"Propinsi"],
   [101,"Aceh"],
   [102,"Sumatera Utara"],
   [103,"Sumatera Barat"],
   [104,"Riau"],
   [105,"Jambi"],
   [106,"Sumatera Selatan"],
   [107,"Bengkulu"],
   [108,"Lampung"],
   [109,"Kepulauan Bangka Belitung"],
   [110,"Kepulauan Riau"],
   [201,"Dki Jakarta"],
   [202,"Jawa Barat"],
   [203,"Jawa Tengah"],
   [204,"Di Yogyakarta"],
   [205,"Jawa Timur"],
   [206,"Banten"],
   [301,"Kalimantan Barat"],
   [302,"Kalimantan Tengah"],
   [303,"Kalimantan Selatan"],
   [304,"Kalimantan Timur"],
   [401,"Sulawesi Utara"],
   [402,"Sulawesi Tengah"],
   [403,"Sulawesi Selatan"],
   [404,"Sulawesi Tenggara"],
   [405,"Gorontalo"],
   [406,"Sulawesi Barat"],
   [501,"Bali"],
   [502,"Nusa Tenggara Barat"],
   [503,"Nusa Tenggara Timur"],
   [601,"Maluku"],
   [602,"Maluku Utara"],
   [603,"Papua"],
   [604,"Papua Barat"]
];

////////////////////////////////////////////////////////////////////////////////////////////////////

} )( window );

( function ( window ) {

if ( !window.siap )
   return;

if ( !window.siap.master )
   return;

////////////////////////////////////////////////////////////////////////////////////////////////////

window.siap.master.lokasi = {
   "100":[["8000","Kab./Kota"]],
   "101":[["8306","Kab. Aceh Besar"],["8307","Kab. Pidie"],["8308","Kab. Aceh Utara"],["8309","Kab. Aceh Timur"],["8310","Kab. Aceh Tengah"],["8311","Kab. Aceh Barat"],["8312","Kab. Aceh Selatan"],["8313","Kab. Aceh Tenggara"],["8314","Kab. Simeulue"],["8315","Kab. Bireuen"],["8316","Kab. Aceh Singkil"],["8317","Kab. Aceh Tamiang"],["8568","Kab. Gayo Luas"],["8569","Kab. Aceh Nagan Raya"],["8570","Kab. Aceh Barat Daya"],["8571","Kab. Aceh Jaya"],["8572","Kab. Bener Meriah"],["8573","Kota Sabang"],["8574","Kota Banda Aceh"],["8575","Kota Lhokseumawe"],["8576","Kota Langsa"],["8436","Kab. Pidie Jaya"],["8437","Kota Subulussalam"]],
   "102":[["8577","Kab. Deli Serdang"],["8578","Kab. Langkat"],["8579","Kab. Karo"],["8580","Kab. Simalungun"],["8581","Kab. Dairi"],["8582","Kab. Asahan"],["8583","Kab. Labuhanbatu"],["8584","Kab. Tapanuli Utara"],["8585","Kab. Tapanuli Tengah"],["8586","Kab. Tapanuli Selatan"],["8587","Kab. Nias"],["8588","Kab. Mandailing Natal"],["8589","Kab. Toba Samosir"],["8279","Kab. Nias Selatan"],["8280","Kab. Pakpak Bharat"],["8281","Kab. Humbang Hasundutan"],["8282","Kab. Samosir"],["8283","Kab. Serdang Bedagai"],["8284","Kota Medan"],["8285","Kota Binjai"],["8286","Kota Tebing Tinggi"],["8287","Kota Pematang Siantar"],["8288","Kota Tanjung Balai"],["8289","Kota Sibolga"],["8290","Kota Padang Sidempuan"],["8447","Kab. Batubara"],["8590","Kab. Padang Lawas"],["8591","Kab. Padang Lawas Utara"],["84965","Kab. Labuhanbatu Utara"],["84966","Kab. Labuhanbatu Selatan"],["84967","Kab. Nias Barat"],["84968","Kab. Nias Utara"],["84969","Kota Gunung Sitoli"],["85003","Kab. Angkola Sipirok"]],
   "103":[["8291","Kab. Agam"],["8292","Kab. Pasaman"],["8293","Kab. Lima Puluh Kota"],["8294","Kab. Solok"],["8295","Kab. Padang Pariaman"],["8296","Kab. Pesisir Selatan"],["8297","Kab. Tanah Datar"],["8298","Kab. Sijunjung"],["8299","Kab. Kepulauan Mentawai"],["8300","Kab. Pasaman Barat"],["8301","Kab. Dharmasraya"],["8302","Kab. Solok Selatan"],["8303","Kota Bukittinggi"],["8304","Kota Padang"],["8305","Kota Padang Panjang"],["8391","Kota Sawahlunto"],["8392","Kota Solok"],["8393","Kota Payakumbuh"],["8394","Kota Pariaman"]],
   "104":[["8395","Kab. Kampar"],["8396","Kab. Bengkalis"],["8397","Kab. Indragiri Hulu"],["8398","Kab. Indragiri Hilir"],["8399","Kab. Pelalawan"],["8400","Kab. Rokan Hulu"],["8401","Kab. Rokan Hilir"],["8402","Kab. Siak"],["8403","Kab. Kuantan Singing"],["8404","Kota Pekanbaru"],["8405","Kota Dumai"]],
   "105":[["8406","Kab. Batanghari"],["8407","Kab. Bungo"],["8427","Kab. Merangin"],["8409","Kab. Tanjung Jabung Barat"],["8410","Kab. Kerinci"],["8411","Kab. Muara Jambi"],["8412","Kab. Tebo"],["8413","Kab. Sarolangun"],["8414","Kab. Tanjung Jabung Timur"],["8415","Kota Jambi"],["84945","Kota Sungai Penuh"]],
   "106":[["8416","Kab. Musi Banyuasin"],["8417","Kab. Ogan Komering Ilir"],["8418","Kab. Ogan Komering Ulu"],["8419","Kab. Muara Enim"],["8477","Kab. Lahat"],["8478","Kab. Musi Rawas"],["8479","Kab. Banyuasin"],["8480","Kab. Ogan Ilir"],["8481","Kab. OKU Selatan"],["8482","Kab. Oku Timur"],["8483","Kota Palembang"],["8484","Kota Lubuk Linggau"],["8485","Kota Prabumulih"],["8486","Kota Pagar Alam"],["8446","Kab. Empat Lawang"]],
   "107":[["8487","Kab. Bengkulu Utara"],["8488","Kab. Rejang Lebong"],["8489","Kab. Bengkulu Selatan"],["8490","Kab. Muko-Muko"],["8491","Kab. Seluma"],["8492","Kab. Kaur"],["8493","Kab. Lebong"],["8494","Kab. Kepahiang"],["8495","Kota Bengkulu"]],
   "108":[["8496","Kab. Lampung Selatan"],["8497","Kab. Lampung Tengah"],["8498","Kab. Lampung Utara"],["8499","Kab. Lampung Barat"],["8500","Kab. Tulang Bawang"],["8501","Kab. Tanggamus"],["8502","Kab. Lampung Timur"],["8503","Kab. Way Kanan"],["8504","Kota Bandar Lampung"],["8535","Kota Metro"],["9102","Kab. Pesawaran"],["84985","Kab. Mesuji"],["84986","Kab. Pringsewu"],["84994","Kab. Tulang Bawang Barat"]],
   "109":[["8536","Kab. Bangka Barat"],["8537","Kab. Bangka Tengah"],["8538","Kab. Bangka Selatan"],["8539","Kab. Belitung Barat"],["8540","Kab. Belitung Timur"],["8541","Kab. Bangka"],["8542","Kab. Belitung"],["8543","Kota Pangkal Pinang"]],
   "110":[["8544","Kab. Kepulauan Riau"],["8545","Kab. Karimun"],["8546","Kab. Natuna"],["8547","Kab. Lingga"],["8548","Kota Batam"],["8549","Kota Tanjung Pinang"],["8424","Kab. Bintan"],["9082","Kab. Kepulauan Anambas"]],
   "201":[["8550","Kab. Kepulauan Seribu"],["8551","Kota Jakarta Pusat"],["8552","Kota Jakarta Utara"],["8553","Kota Jakarta Barat"],["8554","Kota Jakarta Selatan"],["8555","Kota Jakarta Timur"]],
   "202":[["8556","Kab. Bogor"],["8557","Kab. Sukabumi"],["8558","Kab. Cianjur"],["8559","Kab. Bandung"],["8560","Kab. Sumedang"],["8561","Kab. Garut"],["8562","Kab. Tasikmalaya"],["8563","Kab. Ciamis"],["8629","Kab. Kuningan"],["8630","Kab. Majalengka"],["8631","Kab. Cirebon"],["8632","Kab. Indramayu"],["8633","Kab. Subang"],["8634","Kab. Purwakarta"],["8635","Kab. Kerawang"],["8636","Kab. Bekasi"],["8637","Kota Bandung"],["8638","Kota Bogor"],["8639","Kota Sukabumi"],["8640","Kota Cirebon"],["8641","Kota Bekasi"],["8642","Kota Depok"],["8643","Kota Cimahi"],["8644","Kota Tasikmalaya"],["8645","Kota Banjar"],["8429","Kab. Bandung Barat"],["8982","Kota Demo"],["9002","Kota Demo"],["9022","Kota Demo"]],
   "203":[["8646","Kab. Cilacap"],["8647","Kab. Banyumas"],["8648","Kab. Purbalingga"],["8649","Kab. Banjarnegara"],["8650","Kab. Kebumen"],["8651","Kab. Purworejo"],["8652","Kab. Wonosobo"],["8426","Kab. Magelang"],["8654","Kab. Boyolali"],["8655","Kab. Klaten"],["8656","Kab. Sukoharjo"],["8657","Kab. Wonogiri"],["8686","Kab. Karanganyar"],["8687","Kab. Sragen"],["8688","Kab. Grobogan"],["8689","Kab. Blora"],["8690","Kab. Rembang"],["8691","Kab. Pati"],["8692","Kab. Kudus"],["8693","Kab. Jepara"],["8694","Kab. Demak"],["8695","Kab. Semarang"],["8696","Kab. Temanggung"],["8697","Kab. Kendal"],["8698","Kab. Batang"],["8699","Kab. Pekalongan"],["8700","Kab. Pemalang"],["8701","Kab. Tegal"],["8702","Kab. Brebes"],["8703","Kota Magelang"],["8704","Kota Surakarta"],["8705","Kota Salatiga"],["8706","Kota Semarang"],["8707","Kota Pekalongan"],["8708","Kota Tegal"]],
   "204":[["8709","Kab. Bantul"],["8710","Kab. Sleman"],["8711","Kab. Gunung Kidul"],["8712","Kab. Kulonprogo"],["8713","Kota Yogyakarta"]],
   "205":[["8714","Kab. Gresik"],["8715","Kab. Sidoarjo"],["8719","Kab. Mojokerto"],["8720","Kab. Jombang"],["8721","Kab. Bojonegoro"],["8722","Kab. Tuban"],["8250","Kab. Lamongan"],["8251","Kab. Madiun"],["8252","Kab. Ngawi"],["8253","Kab. Magetan"],["8254","Kab. Ponorogo"],["8255","Kab. Pacitan"],["8256","Kab. Kediri"],["8257","Kab. Nganjuk"],["8258","Kab. Blitar"],["8259","Kab. Tulungagung"],["8260","Kab. Trenggalek"],["8261","Kab. Malang"],["8262","Kab. Pasuruan"],["8263","Kab. Probolinggo"],["8264","Kab. Lumajang"],["8265","Kab. Bondowoso"],["8266","Kab. Situbondo"],["8267","Kab. Jember"],["8268","Kab. Banyuwangi"],["8269","Kab. Pamekasan"],["8270","Kab. Sampang"],["8271","Kab. Sumenep"],["8272","Kab. Bangkalan"],["8273","Kota Surabaya"],["8274","Kota Malang"],["8275","Kota Madiun"],["8276","Kota Kediri"],["8277","Kota Mojokerto"],["8278","Kota Blitar"],["8320","Kota Pasuruan"],["8321","Kota Probolinggo"],["8322","Kota Batu"]],
   "206":[["8323","Kab. Pandeglang"],["8324","Kab. Lebak"],["8325","Kab. Tangerang"],["8326","Kab. Serang"],["8327","Kota Cilegon"],["8328","Kota Tangerang"],["9083","Kota Tangerang Selatan"],["85004","Kota Serang"]],
   "301":[["8329","Kab. Sambas"],["8330","Kab. Pontianak"],["8331","Kab. Sanggau"],["8332","Kab. Sintang"],["8333","Kab. Kapuas Hulu"],["8334","Kab. Ketapang"],["8564","Kab. Bengkayang"],["8565","Kab. Landak"],["8566","Kab. Malawi"],["8567","Kota Pontianak"],["8363","Kota Singkawang"],["8408","Kab. Sekadau"],["8438","Kab. Kayong Utara"],["8439","Kab. Kubu Raya"]],
   "302":[["8364","Kab. Kapuas"],["8365","Kab. Barito Selatan"],["8366","Kab. Barito Utara"],["8367","Kab. Kotawaringin Timur"],["8368","Kab. Kotawaringin Barat"],["8369","Kab. Pulang Pisau"],["8370","Kab. Gunung Mas"],["8371","Kab. Barito Timur"],["8372","Kab. Sukamara"],["8373","Kab. Katingan"],["8374","Kab. Lamandau"],["8375","Kab. Seruyan"],["8376","Kab. Murung Raya"],["8377","Kota Palangkaraya"]],
   "303":[["8378","Kab. Banjar"],["8379","Kab. Tanah Laut"],["8380","Kab. Barito Kuala"],["8381","Kab. Tapin"],["8382","Kab. Hulu Sungai Selatan"],["8383","Kab. Hulu Sungai Tengah"],["8384","Kab. Hulu Sungai Utara"],["8385","Kab. Tabalong"],["8386","Kab. Kotabaru"],["8387","Kab. Tanah Bumbu"],["8388","Kab. Balangan"],["8389","Kota Banjarmasin"],["8390","Kota Banjarbaru"]],
   "304":[["8448","Kab. Paser"],["8449","Kab. Kutai Kartanegara"],["8450","Kab. Berau"],["8451","Kab. Bulungan"],["8452","Kab. Malinau"],["8453","Kab. Nunukan"],["8454","Kab. Kutai Barat"],["8455","Kab. Kutai Timur"],["8456","Kab. Penajam Paser Utara"],["8457","Kota Samarinda"],["8458","Kota Balikpapan"],["8459","Kota Tarakan"],["8460","Kota Bontang"],["8431","Kab. Tana Tidung"]],
   "401":[["8461","Kab. Bolaang Mongondow"],["8462","Kab. Minahasa"],["8463","Kab. Sangihe"],["8464","Kab. Kepl. Talaud"],["8465","Kab. Minahasa Selatan"],["8466","Kab. Minahasa Utara"],["8467","Kota Manado"],["8468","Kota Bitung"],["8469","Kota Tomohon"],["8432","Kab. Bolaang Mongondow Utara"],["8433","Kab. Kepl. Sitaro"],["8434","Kab. Minahasa Tenggara"],["8435","Kota Kotamobagu"],["85011","Kab. Bolaang Mongondow Timur"],["85012","Kab. Bolaang Mongondow Selatan"]],
   "402":[["8470","Kab. Banggai Kepulauan"],["8471","Kab. Donggala"],["8472","Kab. Poso"],["8473","Kab. Banggai"],["8474","Kab. Buol"],["8475","Kab. Toli Toli"],["8476","Kab. Morowali"],["8505","Kab. Parigi Muotong"],["8506","Kab. Tojo Una-Una"],["8507","Kota Palu"],["9103","Kab. Sigi"]],
   "403":[["8508","Kab. Maros"],["8509","Kab. Pangkajene Kepulauan"],["8510","Kab. Gowa"],["8511","Kab. Takalar"],["8512","Kab. Jeneponto"],["8513","Kab. Barru"],["8514","Kab. Bone"],["8515","Kab. Wajo"],["8516","Kab. Soppeng"],["8517","Kab. Bantaeng"],["8518","Kab. Bulukumba"],["8519","Kab. Sinjai"],["8520","Kab. Selayar"],["8521","Kab. Pinrang"],["8522","Kab. Sidenreng Rappang"],["8523","Kab. Enrekang"],["8524","Kab. Luwu"],["8525","Kab. Tana Toraja"],["8526","Kab. Luwu Utara"],["8527","Kab. Luwu Timur"],["8528","Kota Makasar"],["8529","Kota Pare Pare"],["8530","Kota Palopo"],["85013","Kab. Toraja Utara"]],
   "404":[["8653","Kab. Konawe"],["8532","Kab. Muna"],["8533","Kab. Buton"],["8534","Kab. Kolaka"],["8600","Kab. Konawe Selatan"],["8601","Kab. Kolaka Utara"],["8602","Kab. Wakatobi"],["8603","Kab. Bombana"],["8604","Kota Kendari"],["8605","Kota Bau-Bau"],["8444","Kab. Buton Utara"],["8445","Kab. Konawe Utara"]],
   "405":[["8606","Kab. Boalemo"],["8607","Kab. Gorontalo"],["8428","Kab. Pohuwato"],["8608","Kab. Bonebolango"],["8609","Kota Gorontalo"],["8430","Kab. Gorontalo Utara"]],
   "406":[["8610","Kab. Mamuju"],["8611","Kab. Mamuju Utara"],["8612","Kab. Polewali"],["8613","Kab. Mamasa"],["8614","Kab. Majene"]],
   "501":[["8615","Kab. Buleleng"],["8616","Kab. Jembrana"],["8617","Kab. Tabanan"],["8618","Kab. Badung"],["8619","Kab. Gianyar"],["8620","Kab. Klungkung"],["8621","Kab. Bangli"],["8622","Kab. Karang Asem"],["8623","Kota Denpasar"]],
   "502":[["8624","Kab. Lombok Barat"],["8625","Kab. Lombok Tengah"],["8626","Kab. Lombok Timur"],["8627","Kab. Sumbawa"],["8628","Kab. Dompu"],["8658","Kab. Bima"],["8659","Kab. Sumbawa Barat"],["8660","Kota Mataram"],["8661","Kota Bima"]],
   "503":[["8662","Kab. Kupang"],["8663","Kab. Timor Tengah Selatan"],["8664","Kab. Timor Tengah Utara"],["8665","Kab. Belu"],["8666","Kab. Alor"],["8667","Kab. Flores Timur"],["8668","Kab. Sikka"],["8669","Kab. Ende"],["8670","Kab. Ngada"],["8671","Kab. Manggarai"],["8672","Kab. Sumba Timur"],["8673","Kab. Sumba Barat"],["8674","Kab. Lembata"],["8675","Kab. Rote Ndao"],["8676","Kab. Manggarai Barat"],["8677","Kota Kupang"],["8440","Kab. Nagekeo"],["8441","Kab. Sumba Barat Daya"],["8442","Kab. Sumba Tengah"],["8443","Kab. Manggarai Timur"],["85029","Kab. Sabu Raijua"]],
   "601":[["8678","Kab. Maluku Tengah"],["8679","Kab. Maluku Tenggara"],["8680","Kab. Buru"],["8425","Kab. Maluku Tenggara Barat"],["8681","Kab. Seram Bagian Barat"],["8682","Kab. Seram Bagian Timur"],["8683","Kab. Kepulauan Aru"],["8684","Kota Ambon"],["8592","Kota Tual"]],
   "602":[["8685","Kab. Halmahera Barat"],["8716","Kab. Halmahera Tengah"],["8717","Kab. Halmahera Utara"],["8718","Kab. Halmahera Selatan"],["8335","Kab. Kepulauan Sula"],["8336","Kab. Halmahera Timur"],["8337","Kota Ternate"],["8338","Kota Tidore Kepulauan"],["85021","Kab. Pulau Morotai"]],
   "603":[["8339","Kab. Jaya Pura"],["8340","Kab. Biak Numfor"],["8341","Kab. Kepulauan Yapen"],["8342","Kab. Merauke"],["8343","Kab. Jayawijaya"],["8344","Kab. Paniai"],["8345","Kab. Nabire"],["8346","Kab. Puncak Jaya"],["8347","Kab. Mimika"],["8348","Kab. Keerom"],["8349","Kab. Sarmi"],["8350","Kab. Asmat"],["8351","Kab. Mappi"],["8352","Kab. Boven Digul"],["8353","Kab. Yahukimo"],["8354","Kab. Pegunungan Bintang"],["8531","Kab. Supiori"],["8355","Kab. Waropen"],["8356","Kab. Tolikara"],["8357","Kota Jayapura"],["8593","Kab. Mamberamo Raya"],["8594","Kab. Dogiyai"],["8595","Kab. Lanny Jaya"],["8596","Kab. Mamberamo Tengah"],["8597","Kab. Nduga"],["8598","Kab. Puncak"],["8599","Kab. Yalimo"],["85027","Kab. Intan Jaya"],["85028","Kab. Deiyai"]],
   "604":[["8358","Kab. Fak-Fak"],["8359","Kab. Sorong"],["8360","Kab. Manokwari"],["8361","Kab. Kaimana"],["8362","Kab. Sorong Selatan"],["8420","Kab. Raja Ampat"],["8421","Kab. Teluk Bintuni"],["8422","Kab. Teluk Wondama"],["8423","Kota Sorong"],["85020","Kab. Tambrauw"]]
};

////////////////////////////////////////////////////////////////////////////////////////////////////

} )( window );

var map, currentPosition, directionsDisplay, directionsService;

			function initialize(lat, lon) {
				directionsDisplay = new google.maps.DirectionsRenderer();
				directionsService = new google.maps.DirectionsService();

				currentPosition = new google.maps.LatLng(lat, lon);

				map = new google.maps.Map(document.getElementById('map_canvas'), {
					zoom : 15,
					center : currentPosition,
					mapTypeId : google.maps.MapTypeId.ROADMAP
				});

				directionsDisplay.setMap(map);

				var currentPositionMarker = new google.maps.Marker({
					position : currentPosition,
					map : map,
					title : "Current position"
				});

				var infowindow = new google.maps.InfoWindow();
				google.maps.event.addListener(currentPositionMarker, 'click', function() {
					infowindow.setContent("Current position: latitude: " + lat + " longitude: " + lon);
					infowindow.open(map, currentPositionMarker);
				});
			}

			function locError(error) {
				// initialize map with a static predefined latitude, longitude
				initialize(59.3426606750, 18.0736160278);
			}

			function locSuccess(position) {
				initialize(position.coords.latitude, position.coords.longitude);
			}

			function calculateRoute() {
				var targetDestination = $("#target-dest").val();
				if (currentPosition && currentPosition != '' && targetDestination && targetDestination != '') {
					var request = {
						origin : currentPosition,
						destination : targetDestination,
						travelMode : google.maps.DirectionsTravelMode["DRIVING"]
					};

					directionsService.route(request, function(response, status) {
						if (status == google.maps.DirectionsStatus.OK) {
							directionsDisplay.setPanel(document.getElementById("directions"));
							directionsDisplay.setDirections(response);

							/*
							 var myRoute = response.routes[0].legs[0];
							 for (var i = 0; i < myRoute.steps.length; i++) {
							 alert(myRoute.steps[i].instructions);
							 }
							 */
							$("#results").show();
						} else {
							$("#results").hide();
						}
					});
				} else {
					$("#results").hide();
				}
			}


			$(document).live("pagebeforeshow", "#map_page", function() {
				navigator.geolocation.getCurrentPosition(locSuccess, locError);
			});

			$(document).on('click', '#directions-button', function(e) {
				e.preventDefault();
				calculateRoute();
			});