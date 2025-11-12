'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('geofences', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      latitude: {
        type: Sequelize.DECIMAL(10, 8),
        allowNull: false,
      },
      longitude: {
        type: Sequelize.DECIMAL(11, 8),
        allowNull: false,
      },
      radius: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('geofences', ['userId'], {
      name: 'geofences_userId_index',
    });
    await queryInterface.addIndex('geofences', ['latitude', 'longitude'], {
      name: 'geofences_location_index',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('geofences');
  },
};

