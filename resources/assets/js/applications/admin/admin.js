customModules.adminController = {
    dialog: {},
    run : function(params) {
        var self = this;

        $(document).on('click', '.chat-from-member', function(e) {
            e.preventDefault();
            var link = $(this);
            var li = link.parent();
            var id = link.data('id');

            self.dialog = {
                from_user_id: id,
                to_user_id: null
            };

            $('.from-members li').removeClass('active');

            $('#dialogUsers, #chatContainer').html('');

            li.addClass('active');

            self.loadDialogUsers(id);

            return false;
        });

        $(document).on('click', '.chat-to-member', function(e) {
            e.preventDefault();
            var link = $(this);
            var li = link.parent();
            var id = link.data('id');

            self.dialog.to_user_id = id;

            $('.to-members li').removeClass('active');

            li.addClass('active');

            self.initDialog();

            return false;
        });

        $(document).on('click', '.more', function(e) {
            e.preventDefault();

            var link = $(this);
            var url = link.attr('href');

            link.remove();
            self.loadMessages(url);

            return false;
        });

        $(document).on('click', '.panel .close', function() {
            var panel = $(this).parents('.panel');
            panel.remove();
            self.dialog = {};
            $('.members li').removeClass('active');
        });

        $(document).on('click', '.remove-message', function(e) {
            e.preventDefault();

            var link = $(this);
            var messageContainer = link.parents('.msg');
            var id = messageContainer.data('id');

            self.removeMessage(id);

            return false;
        });
    },
    loadDialogUsers: function(id) {
        var self = this;
        var container = $('#dialogUsers');

        container.prepend(self.spinnerTemplate);

        $.ajax({
            type: 'get',
            url: '/admin/users',
            data: {
                id: self.dialog.from_user_id
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            dataType: 'json',
            success: function (response) {
                if (response.status == 'success') {
                    $.each(response.users, function(index, user) {
                        container.prepend(self.renderUser(user));
                    });
                }
            },
            error: function(data){
                if( data.status === 422) {
                    var errors = data.responseJSON;
                    console.log(errors);

                }
            },
            complete: function () {
                $('.spinner', container).remove();
            }
        });
    },
    loadMessages: function (url, callback) {
        var self = this;
        var container = $('#messageContainer');

        container.prepend(self.spinnerTemplate);

        if ('undefined' == typeof url) {
            url = '/admin/messages';
        }

        $.ajax({
            type: 'get',
            url: url,
            data: {
                from_user_id: self.dialog.from_user_id,
                to_user_id: self.dialog.to_user_id
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            dataType: 'json',
            success: function (response) {
                if (response.status == 'success') {

                    $.each(response.messages, function(index, message) {
                        container.prepend(self.renderMessage(message));
                    });

                    if (response.next) {
                        container.prepend('<a class="more" href="' + response.next + '">Show more</a>');
                    }

                    if ('function' == typeof callback) {
                        callback(response);
                    }
                }
            },
            error: function(data){
                if( data.status === 422) {
                    var errors = data.responseJSON;
                    console.log(errors);

                }
            },
            complete: function () {
                $('.spinner', container).remove();
            }
        });
    },
    removeMessage: function(id) {
        var self = this;
        var container = $('#messageContainer');
        $.ajax({
            type: 'delete',
            url: '/admin/remove',
            data: {
                id: id
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            dataType: 'json',
            success: function (response) {
                if (response.status == 'success') {
                    $('.msg[data-id="' + id + '"]', container).remove();
                }
            },
            error: function(data){
                if( data.status === 422) {
                    var errors = data.responseJSON;
                    console.log(errors);
                }
            }
        });
    },
    initDialog: function () {
        var self = this;

        self.renderDialog();
    },
    renderDialog: function() {
        var self = this;
        var dialogTemplate = require("./../../templates/admin/dialog.html");
        $('#chatContainer').html(dialogTemplate());

        self.loadMessages(undefined, function() {
            var container = $('#messageContainer');
            container.scrollTop(container[0].scrollHeight);
        });
    },
    renderMessage: function(message) {
        var messageTemplate = require("./../../templates/admin/message.html");
        return messageTemplate(message);
    },
    renderUser: function(user) {
        var memberTemplate = require("./../../templates/admin/member.html");
        return memberTemplate(user);
    },
};