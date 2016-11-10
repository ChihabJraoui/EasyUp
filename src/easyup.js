/*
 * Javascript Modal Plugin
 *
 * Created By Chihab JRAOUI
 *
 * Version 1.0
 */


function EasyUp(options)
{
    this.options = {
        //ID
        id: null,

        //
        url: null,

        // Direction
        direction: 'ltr',

        // Target
        attach: null,           // jquery selector
        trigger: 'submit',

        // Thumbnail
        thumbnail_width: 100,
        thumbnail_height: 56,

        // Text
        uploadText: '<strong>Drag and drop</strong> files here <br /> Or <strong>Browse</strong> to begin upload'

    };



    /* Merge Options */
    this.options = jQuery.extend(true, this.options, options);



    /* get unique ID */
    if(this.options.id == null)
    {
        this.options.id = "sweetbox-" + EasyUp.getUniqueID();
    }

    this.id = this.options.id;



    /*
     *  Create Plugin Elements
     */

    this._createElements = function ()
    {
        /* upload */
        this.easyup_upload = $('<div />', {
            'class': 'easyup--upload'
        }).appendTo(this.options.attach);

        // form
        this.easyup_form = $('<form />', {
            'id': 'EasyUp-form-' + this.id,
            'encrypte': 'multipart/form-data'
        }).appendTo(this.easyup_upload);

        /* Label */
        this.easyup_label = $('<label />', {
            'for': 'easyup-input'
        }).appendTo(this.easyup_form);

        /* Upload Icon */
        $('<img />', {
            'src': 'icons/cloud_upload.svg'
        }).appendTo(this.easyup_label);

        /* Text */
        $('<span />', {
            'html': this.options.uploadText
        }).appendTo(this.easyup_label);

        /* file input */
        this.easyup_input = $('<input />', {
            'id': 'easyup-input',
            'type': 'file',
            'name': 'files[]',
            'multiple': 'multiple'
        }).appendTo(this.easyup_form);

        /* EasyUp Files */
        this.easyup_files = $('<div />', {
            'class': 'easyup--files'
        }).appendTo(this.options.attach);

        // EasyUp table
        this.easyup_table = $('<table />', {
            'class': 'table'
        }).appendTo(this.easyup_files);

    };







    /*-------------------------
     *  Preview
     *--------------------------*/

    this._createFilePreview = function (file)
    {
        // Add Table Row
        this.easyup_row = $('<tr />').prependTo(this.easyup_table);

        // file info
        this.easyup_fileInfo = $('<td />', {
            'id': 'file-info-' + file.id,
            'class': 'file-info',
            'html': file.name + ' / ' + EasyUp.formatFileSize(file.size)
        }).css('width', '100%').appendTo(this.easyup_row);

        // File Status Icon
        $('<i />', {
            'id': 'file-status-' + file.id,
            'class': 'glyphicon glyphicon-refresh text-primary'
        }).appendTo(this.easyup_fileInfo);

        // file progress bar
        var progress = $('<div class="progress" />').appendTo(this.easyup_fileInfo);

        $('<div />', {
            'id': 'progress-bar-' + file.id,
            'class': 'progress-bar progress-bar-striped active',
            'aria-valuemin': 0,
            'aria-valuemax': 100,
            'aria-valuenow': 0
        }).appendTo(progress);

     };



    /*
     *  Send jQuery Ajax Request
     */

    this._sendAjaxRequest = function (file)
    {
        var data = new FormData();
        data.append('file', file);

        $.ajax({
            url: this.options.url,
            type: 'POST',
            data: data,
            contentType: false,
            processData: false,
            cache: false,
            dataType: 'JSON',
            xhr: function() {

                //upload Progress
                var xhr = $.ajaxSettings.xhr();
                if (xhr.upload)
                {
                    xhr.upload.addEventListener('progress', function(event) {
                        var percent = 0;
                        var position = event.loaded || event.position;
                        var total = event.total;

                        if (event.lengthComputable) {
                            percent = Math.ceil(position / total * 100);
                        }

                        //update progressbar
                        $('#progress-bar-' + file.id).css("width", + percent +"%");

                    }, true);
                }
                return xhr;
            },
            error: function (xhr)
            {
                // TODO
            },
            success: function (result)
            {
                var fileInfo = $('#file-info-' + file.id),
                    fileStatus = $('#file-status-' + file.id);

                if(result.success == 1)
                {
                    fileInfo.find('.progress-bar').addClass('progress-bar-success')
                        .removeClass('progress-bar-striped active');

                    fileStatus.removeClass('glyphicon-refresh text-primary')
                        .addClass('glyphicon-ok text-success');
                }
                else
                {
                    //$('#progress-bar-' + file.id).addClass('progress-bar-danger');
                }
            }

        })

    };



    /*
     *  RUN
     */

    this._run = function ()
    {
        // Check Url
        this.options.url != null || console.log('Error: url property is not set !');

        if(this.options.attach != null)
        {
            // Add class
            this.options.attach.addClass('easyup');

            // Create Plugin Elements
            this._createElements();

            // Listen To Form Change Event
            this.easyup_form.on('change', function()
            {
                var files = this.easyup_input[0].files;

                for(var i = 0; i < files.length; i++)
                {
                    files[i].id = new Date().getTime();

                    // File Preview
                    this._createFilePreview(files[i]);

                    // send file
                    this._sendAjaxRequest(files[i]);
                }

            }.bind(this))

            // Drag Over Event
            .on('dragover', function ()
            {
                this.easyup_upload.addClass('is-dragover');

            }.bind(this))

            .on('dragleave', function ()
            {
                this.easyup_upload.removeClass('is-dragover');

            }.bind(this));
        }
        else
        {
            console.log('EasyUp Error: Form Element is not set !!');
        }
    };


    // Run App
    this._run();

}



/*
 *  Format File Size
 */

EasyUp.formatFileSize = function (bytes)
{
    if(bytes == 0)
        return '0 Byte';

    var k = 1024; // or 1024 for binary
    //var dm = decimals + 1 || 3;
    var dm = 2;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};


/*
 *  Get Unique ID
 */

EasyUp.getUniqueID = (function()
{
    var i = 1;
    return function()
    {
        return i++;
    };
}());


/*
 *  Make jBox usable with jQuery selectors
 */

jQuery.fn.EasyUp = function(options)
{
    options = jQuery.extend(options, {attach: this});
    return new EasyUp(options);
};



// TODO: improve thumbnail
// TODO: add arabic version



/*
 *  Get Thumbnail Data
 */

/*this._getThumbData = function (file, thumbnail)
 {
 var reader = new FileReader();

 reader.onloadend = function (event)
 {
 var img = new Image();

 img.onload = function()
 {
 var canvas = document.createElement('canvas');

 canvas.width = this.options.thumbnail_width;
 canvas.height = this.options.thumbnail_height;

 var ctx = canvas.getContext('2d');
 ctx.drawImage(img, 0, 0, this.options.thumbnail_width, this.options.thumbnail_height);

 thumbnail.attr('src', canvas.toDataURL(file.type));

 }.bind(this, thumbnail);

 img.src = event.target.result;

 }.bind(this, thumbnail);

 reader.readAsDataURL(file);
 };*/