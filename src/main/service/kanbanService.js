(function () {
    'use strict';

    var mongoose = require('mongoose');
    var _ = require('../util/util');

    var Kanban = mongoose.model('Kanban');
    var CardService = require('./cardService');
    var TODO_LIST = "TODO";


    /**
     * Service that handles operations involving backlogs.
     */
    var KanbanService = {};


    /**
     * Create a new kanban when a new sprint is created.
     *
     * @param {Object} user User to be saved.
     * @returns {Promise} Promise with the new user.
     */
    KanbanService.createKanban = function (sprintId) {

        var kanban = {
            sprint: sprintId,
            userStories: []
        }
        return new Kanban(kanban).save()
            .then(function (persistedKanban) {
                return persistedKanban.toObject();
            });
    }

    /**
     * Get the kanban with the given ID.
     *
     * @param {Number} id ID of the kanban.
     * @param {Boolean} raw If true, this method will return the raw Mongoose
     *                      document instead of a JavaScript object.
     * @return {Promise} Promise with the sprint.
     */
    KanbanService.getKanban = function (kanbanId, raw) {
        var params = {
            _id: kanbanId
        };
        var rawKanban = Kanban.findOne(params).exec();

        return rawKanban.then(function (kanban) {
            if (!kanban) {
                throw Error('Nenhum kanban com id ' + kanbanId + ' foi encontrado.');
            }
            return raw ? rawKanban : kanban.toObject();
        });
    }

    /**
     * Get the kanban with the given sprint ID.
     *
     * @param {Number} id ID of the sprint.
     * @param {Boolean} raw If true, this method will return the raw Mongoose
     *                      document instead of a JavaScript object.
     * @return {Promise} Promise with the sprint.
     */
    KanbanService.getKanbanBySprintId = function (sprintId, raw) {
        var params = {
            sprint: sprintId
        };
        var rawKanban = Kanban.findOne(params).exec();

        return rawKanban.then(function (kanban) {
            if (!kanban) {
                throw Error('Nenhum kanban encontrado na sprint de id ' + sprintId + '.');
            }
            return raw ? rawKanban : kanban.toObject();
        });
    }


    KanbanService.addUserStory = function (sprintId, userStoryId){
        return KanbanService.getKanbanBySprintId(sprintId).then(function(kanban){
            kanban.userStories.push(userStoryId);
            return KanbanService.updateKanban(kanban._id, kanban);
        })
    
    }

    /**
     * Add a card to the kanban
     * @param {Object} kanban kanban
     * @param {Object} cardSaved card that will be saved
     * @param {String} nameList name of the list that card will saved
     */
    KanbanService.addCardToKanban = function (kanban, cardSaved, nameList) {

        nameList = nameList || TODO_LIST;

        var list = KanbanService._getList(kanban, nameList);
        list.cards.push(cardSaved);
        kanban.lists = kanban.lists.map(function (item) {
            if (item.name === list.name) {
                item = list;
            }
            return item;
        });
        return KanbanService.updateKanban(kanban._id, kanban);
    }

    /**
     * Update an existing kanban.
     * 
     * @param {Number} kanbanId  ID of the kanban
     * @param {Object} kanban Updated kanban
     * @returns {Promise} Promise with the updated kanban.
     */
    KanbanService.updateKanban = function (kanbanId, kanban) {
        return KanbanService.getKanban(kanbanId, true).then(function (kanbanBD) {
            _.copyModel(kanbanBD, kanban);
            return kanbanBD.save().then(function (persistedKanban) {
                return persistedKanban.toObject();
            });

        });
    }

    /**
     * Get the list with the given nameList in a specific kanban.
     * 
     * @param {Number} kanbanId  ID of the kanban
     * @param {String} nameList  The name of the searched list
     */
    KanbanService.getListByName = function (kanbanId, nameList) {
        return KanbanService.getKanban(kanbanId).then(function (kanban) {
            return KanbanService._getList(kanban, nameList);
        });

    }

    /**
     * Get the list with the given nameList in a specific kanban.
     * 
     * @param {Object} kanbanId  Kkanban
     * @param {String} nameList  The name of the searched list
     */
    KanbanService._getList = function (kanban, nameList) {

        var list = kanban.lists.filter(function (list) {
            return list.name === nameList;
        });

        if (list.length === 0) {
            throw Error('Não foi achada nenhuma lista com nome ' + nameList + ' no kanban de id ' + kanban._id + '.');
        }
        return list[0];

    }



    module.exports = KanbanService;
})();
