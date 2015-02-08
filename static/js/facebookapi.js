var Facebook = function () {
    'use strict';

    return {

        init: function (callback) {

            $.getScript('//connect.facebook.net/en_US/all.js', function () {
                FB.init({
                    appId  : '1467336330221256',
                    status : true,
                    cookie : true
                });

                callback();
            });
        }
    };
}();