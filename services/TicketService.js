const { v4: uuidv4 } = require("uuid");
const TicketRepository = require("../repositories/TicketRepository");
const NotificationService = require("./NotificationService");

class TicketService {
  constructor() {
    this.repo = new TicketRepository();
    this.notificationService = new NotificationService();
  }

  createTicket(data) {
    const ticket = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      status: "nuevo",
      priority: data.priority || "medium",
      assignedUser: null,
    };

    this.repo.save(ticket);

    this.notificationService.create(
      "email",
      `Nuevo ticket creado: ${ticket.title}`,
      ticket.id,
    );

    return ticket;
  }

  assignTicket(id, user) {
    const ticket = this.repo.update(id, { assignedUser: user });

    if (ticket) {
      this.notificationService.create(
        "email",
        `El ticket ${ticket.id} fue asignado a ${user}`,
        ticket.id,
      );
    }

    return ticket;
  }

  changeStatus(id, newStatus) {
    const ticket = this.repo.update(id, { status: newStatus });

    if (ticket) {
      this.notificationService.create(
        "push",
        `El ticket ${ticket.id} cambió a ${newStatus}`,
        ticket.id,
      );
    }

    return ticket;
  }

  list(page = 1, limit = 5) {
    const tickets = this.repo.findAll();
    const startIndex = (page - 1) * limit;
    const paginatedTickets = tickets.slice(startIndex, startIndex + limit);

    return {
      page,
      limit,
      totalTickets: tickets.length,
      totalPages: Math.ceil(tickets.length / limit),
      tickets: paginatedTickets,
    };
  }

  deleteTicket(id) {
    const deleted = this.repo.delete(id);

    if (!deleted) {
      throw new Error("Ticket no encontrado");
    }

    return true;
  }
}

module.exports = TicketService;