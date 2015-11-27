var bassify = angular.module("bassify", []);

var bootstrapModule = angular.module("bootstrapModule", []);

bootstrapModule.factory("bootstrapper", function($q, $timeout){
    return {
        bootstrap: function (appName){
            var deferred = $q.defer();

            var myApp = angular.module(appName);
            var mopidy = new Mopidy({"callingConvention": "by-position-only"});
            $timeout(mopidy.on("state:online", function() {
                myApp.constant('mopidy', mopidy);
                console.log("Mopidy a constant");
                angular.bootstrap(document, [appName]);
                deferred.resolve();
            }), 2000);

            return deferred.promise;
        }
    };
});

// Used as root for bootstrap app.
var appContainer = document.createElement('div');
bootstrapModule.run(function (bootstrapper) {
    bootstrapper.bootstrap("bassify").then(function() {
        // Destroy bootstrap app when done.
        appContainer.remove();
    });
});

angular.element(document).ready(function() {
    angular.bootstrap(appContainer, ["bootstrapModule"]);
});

bassify.controller('TracklistController', function($scope, mopidy) {
        var self = this;

        function get(key, object) {
            return object[key];
        }

        /*
        mopidy.on("state:online", function() {
            console.log("we're online");
            self.ready = true;
            */

        mopidy.playlists.getPlaylists()
            .fold(get, 0)
            .fold(get, 'tracks')
            .then(mopidy.tracklist.add)
            .then(getTracklistNames);
        //});

        function extractTrackFromTlTrack(tlTrack, index, tracks) {
            return {
                trackName: tlTrack.track.name,
                artists: tlTrack.track.artists,
                album: tlTrack.track.album.name,
                length: tlTrack.track.length,
                uri: tlTrack.track.uri
            };
        }

		function getTracklistNames(tracks) {
            $scope.$apply(function() {
                self.tracks = tracks.map(extractTrackFromTlTrack);
            });
		}

        function getPlaylistNames(playlists) {
            self.playlists = playlists;
            return playlists;
        }
	})
    .controller('PlaylistController', function($scope){
        var self = this;
    });
