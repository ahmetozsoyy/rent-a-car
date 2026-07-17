using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RentACar.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Phase15_Checkout : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "DiscountAmount",
                table: "Reservations",
                type: "numeric(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "DriverFirstName",
                table: "Reservations",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DriverLastName",
                table: "Reservations",
                type: "character varying(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DriverPhone",
                table: "Reservations",
                type: "character varying(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DriverTcNo",
                table: "Reservations",
                type: "character varying(11)",
                maxLength: 11,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PaymentMethod",
                table: "Reservations",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiscountAmount",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "DriverFirstName",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "DriverLastName",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "DriverPhone",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "DriverTcNo",
                table: "Reservations");

            migrationBuilder.DropColumn(
                name: "PaymentMethod",
                table: "Reservations");
        }
    }
}
