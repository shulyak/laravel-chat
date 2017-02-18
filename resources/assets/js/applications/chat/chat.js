customModules.chatController = {
    dialog: {},
    spinnerTemplate: '<i class="fa fa-spinner fa-spin spinner"></i>',
    socketIoClient: null,
    socketHost: null,
    socketIoPort: null,
    token: null,
    run : function(params) {
        var self = this;

        self.socketIoHost = params.socketIoHost;
        self.socketIoPort = params.socketIoPort;
        self.token = params.token;

        self.socketIoConnect();

        $(document).on('click', '#submitSend', function(e) {
            e.preventDefault();

            var btn = $(this);

            if (btn.hasClass('disabled')) {
                return false;
            }

            btn.button('Sending Message');
            btn.addClass('disabled');

            self.sendMessage(function () {
                btn.button('reset');
                btn.removeClass('disabled');
            });

            return false;
        });

        $(document).on('click', '.chat-member', function(e) {
            e.preventDefault();
            var link = $(this);
            var li = link.parent();
            var id = link.data('id');
            var username = link.data('username');

            self.dialog = {
                id: id,
                username: username,
            };

            $('.members li').removeClass('active');

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
    },
    loadMessages: function (url, callback) {
        var self = this;
        var container = $('#messageContainer');

        container.prepend(self.spinnerTemplate);

        if ('undefined' == typeof url) {
            url = '/messages';
        }

        $.ajax({
            type: 'get',
            url: url,
            data: {
                id: self.dialog.id
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
    sendMessage: function(callback) {
        var self = this;
        var textarea = $('#message');
        var container = $('#messageContainer');
        $.ajax({
            type: 'post',
            url: '/chat',
            data: {
                message: textarea.val(),
                id: self.dialog.id
            },
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            dataType: 'json',
            success: function (response) {
                if (response.status == 'success') {
                    textarea.val('');
                    container.append(self.renderMessage(response.message));
                    container.scrollTop(container[0].scrollHeight);
                }
            },
            error: function(data){
                if( data.status === 422) {
                    var errors = data.responseJSON;
                    console.log(errors);

                }
            },
            complete: function () {
                if ('function' == typeof callback) {
                    callback();
                }
            }
        });
    },
    initDialog: function () {
        var self = this;

        self.removeMemberMark(self.dialog.id);

        self.renderDialog();
    },
    renderDialog: function() {
        var self = this;
        var dialogTemplate = require("./../../templates/chat/dialog.html");
        $('#chatContainer').html(dialogTemplate({
            username: self.dialog.username
        }));

        self.loadMessages(undefined, function() {
            var container = $('#messageContainer');
            container.scrollTop(container[0].scrollHeight);
        });
    },
    renderMessage: function(message) {
        var messageTemplate = require("./../../templates/chat/message.html");
        return messageTemplate(message);
    },

    addMemberMark: function(id) {
        var self = this;
        var member = $('.chat-member[data-id="' + id + '"]');
        var messages = $('.badge', member);
        var count = 1;
        if (messages.length) {
            count = count + (messages.data('count') * 1);
        }

        self.removeMemberMark(id);

        self.renderMemberMark(id, count);
    },

    removeMemberMark: function(id) {
        var member = $('.chat-member[data-id="' + id + '"]');
        $('.badge', member).remove();
    },

    renderMemberMark: function(id, count) {
        var member = $('.chat-member[data-id="' + id + '"]');
        member.append('<span class="badge" data-count="' + count + '">' + count + '</span>');
    },

    socketIoConnect: function () {
        var self = this;

        self.socketIoDisconnect();
        self.socketIoClient = io('http://' + self.socketIoHost + ':' + self.socketIoPort, {
            query: 'token=' + self.token
        });

        self.socketIoClient.on('chat:message', function (data) {
            if (self.dialog.id == data.user_id) {
                var container = $('#messageContainer');
                container.append(self.renderMessage(data));
                container.scrollTop(container[0].scrollHeight);
            } else {
                self.addMemberMark(data.user_id);
            }
        });
    },

    socketIoDisconnect: function () {
        var self = this;
        if (self.socketIoClient !== null) {
            self.socketIoClient.disconnect();
            self.socketIoClient = null;
        }
    }
};