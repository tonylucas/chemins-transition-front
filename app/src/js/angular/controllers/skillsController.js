app.controller('SkillsController', function ($scope, skillData, mapService, $timeout) {
    $scope.movies = [];
    $scope.placeholder = "Find Skills";
    $timeout(function () {
        return mapService.resetFilter();
    });
    skillData.getSkills().then(function (skills) {
        var skill, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = skills.length; _i < _len; _i++) {
            skill = skills[_i];
            _results.push($scope.movies.push(skill.name));
        }
        return _results;
    });
    return $scope.filter = function (data) {
        mapService.hasSkill(data);
        return mapService.myLayer.eachLayer(function (layer) {
            var popupContent;
            popupContent = "<div class='text-center popup'><strong>" + layer.feature.properties.name + "</strong>" + "<br><img src='" + layer.feature.avatar + "'><br>";
            angular.forEach(layer.feature.properties.skills, function (value) {
                return popupContent = popupContent + "<span class='tag'>" + value.name + "</span>";
            });
            popupContent = popupContent + "</div>";
            layer.bindPopup(popupContent);
            layer.on('mouseover', function (e) {
                return layer.openPopup();
            });
            layer.on('mouseout', function (e) {
                return layer.closePopup();
            });
            return layer.on('click', function (e) {
                return $scope.showModal(e);
            });
        });
    };
});