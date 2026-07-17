using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RentACar.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateVehicleEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BodyType",
                table: "Vehicles",
                type: "character varying(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FuelType",
                table: "Vehicles",
                type: "character varying(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Vehicles",
                type: "character varying(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "MinDriverAge",
                table: "Vehicles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Transmission",
                table: "Vehicles",
                type: "character varying(30)",
                maxLength: 30,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BodyType",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "FuelType",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "MinDriverAge",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "Transmission",
                table: "Vehicles");
        }
    }
}
