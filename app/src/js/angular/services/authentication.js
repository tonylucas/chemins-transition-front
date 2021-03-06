app.service('authService', function (ipCookie, userData, $state, $modal, $q) {
    return {
        user: {
            type: 'Organization'
        },
        token: null,
        needsLogin: false,
        invitation: {
            active: false,
            type: 'Person'
        },

        setInvitation: function(invitation) {
            this.invitation = invitation;
            this.invitation.active = true;
            this.user.email = invitation.email;
            this.user.type = invitation.type;
        },
        setSession: function (user) {
            console.log(user)
            this.user = user;
            this.token = user.token;
            ipCookie('token', this.token, {
                expires: 21
            });
            return ipCookie('email', this.user.email, {
                expires: 21
            });
        },
        isAuthorize: function () {
            var self;
            self = this;
            this.needsLogin = true;
            if (!(ipCookie('token') || ipCookie('mail'))) {
                return $state.go('index');
            }
            return userData.checkUser().then(function (result) {
                return this.needsLogin = false;
            }, function (error) {
                if (error === 401) {
                    self.destroySession();
                    return $state.go('index').then(function () {
                        return $state.reload();
                    });
                }
            });
        },
        showLogin: function (size) {
            this.login = $modal.open({
                templateUrl: 'partials/login.html',
                controller: 'LoginController',
                windowClass: 'tiny animated fadeInDown'
            });
            return this.login.result.then(function (selectedItem) {
                return $scope.selected = selectedItem;
            });
        },
        hideLogin: function () {
            return this.login.dismiss('cancel');
        },
        showRegister: function (size) {
            this.register = $modal.open({
                templateUrl: 'partials/register.html',
                controller: 'RegisterController',
                windowClass: 'tiny animated fadeInDown'
            });
            return this.register.result.then(function (selectedItem) {
                return $scope.selected = selectedItem;
            });
        },

        showInvitation: function (size) {
            this.invitation = $modal.open({
                templateUrl: 'partials/invitation.html',
                controller: 'InvitationController',
                windowClass: 'tiny animated fadeInDown'
            });
            this.invitation.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            });      
        },
        hideInvitation: function () {
            return this.invitation.dismiss('cancel');
        },
        hideRegister: function () {
            return this.register.dismiss('cancel');
        },
        destroySession: function () {
            ipCookie.remove('token');
            ipCookie.remove('email');
            this.user = {};
        },
        getGeocode: function (data) {
            var deferred, geocoder, latlng;
            deferred = $q.defer();
            geocoder = new google.maps.Geocoder();
            latlng = new google.maps.LatLng(parseFloat(data.coordinates[1]), parseFloat(data.coordinates[0]));
            geocoder.geocode({
                'latLng': latlng
            }, function (results, status) {
                return deferred.resolve(results);
            });
            return deferred.promise;
        },
        setUserCoordinates: function (user, data) {
            var coordinates;
            if (data.details) {
                coordinates = data.details.geometry.location;
                user.coordinates = {
                    lt: coordinates.D,
                    lg: coordinates.k
                };
            }
            return user;
        }
    };
});