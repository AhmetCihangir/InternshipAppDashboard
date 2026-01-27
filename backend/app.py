"""
Productivity/Efficiency Widget - Flask Backend
================================================
A clean, modular Flask API that calculates user efficiency 
based on tasks and returns visual charts as base64 images.
"""

import io
import base64
from flask import Flask, jsonify
from flask_cors import CORS
import matplotlib
matplotlib.use('Agg')  # Use non-GUI backend for server rendering
import matplotlib.pyplot as plt
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend


def get_mock_tasks():
    """
    Generate mock task data for testing.
    Returns a list of task dictionaries with varied difficulty and completion status.
    
    Schema: {'id': int, 'title': str, 'difficulty': int (1-5), 'is_completed': bool}
    """
    return [
        # High difficulty completed tasks (good for efficiency)
        {"id": 1, "title": "Implement API Authentication", "difficulty": 5, "is_completed": True},
        {"id": 2, "title": "Database Schema Design", "difficulty": 4, "is_completed": True},
        {"id": 3, "title": "Setup CI/CD Pipeline", "difficulty": 5, "is_completed": True},
        
        # Medium difficulty mixed
        {"id": 4, "title": "Write Unit Tests", "difficulty": 3, "is_completed": True},
        {"id": 5, "title": "Code Review Session", "difficulty": 2, "is_completed": True},
        {"id": 6, "title": "API Documentation", "difficulty": 3, "is_completed": False},
        {"id": 7, "title": "Bug Fix: Login Issue", "difficulty": 3, "is_completed": True},
        
        # Low difficulty tasks
        {"id": 8, "title": "Update README", "difficulty": 1, "is_completed": True},
        {"id": 9, "title": "Team Meeting Notes", "difficulty": 1, "is_completed": True},
        {"id": 10, "title": "Email Status Report", "difficulty": 1, "is_completed": False},
        
        # Incomplete high difficulty (impacts efficiency negatively)
        {"id": 11, "title": "Microservices Migration", "difficulty": 5, "is_completed": False},
        {"id": 12, "title": "Performance Optimization", "difficulty": 4, "is_completed": False},
        
        # Additional varied tasks
        {"id": 13, "title": "Frontend Integration", "difficulty": 4, "is_completed": True},
        {"id": 14, "title": "Security Audit Prep", "difficulty": 4, "is_completed": True},
        {"id": 15, "title": "Onboarding Docs", "difficulty": 2, "is_completed": False},
    ]


def get_mock_weekly_efficiency():
    """
    Generate mock weekly efficiency data.
    Returns efficiency scores for each day of the week (Mon-Sun).
    
    In a real app, this would query historical task completion data.
    """
    return {
        "Monday": 72.5,
        "Tuesday": 65.3,
        "Wednesday": 78.9,
        "Thursday": 81.2,
        "Friday": 68.1,  # Today's calculated efficiency
        "Saturday": None,  # Future days are None
        "Sunday": None
    }

def calculate_weighted_efficiency(tasks):
    """
    Calculate weighted efficiency based on task difficulty.
    
    Formula: (Sum of Difficulty of COMPLETED Tasks / Sum of Difficulty of ALL Tasks) * 100
    
    Args:
        tasks: List of task dictionaries
        
    Returns:
        float: Efficiency percentage (0-100), rounded to 1 decimal place
    """
    if not tasks:
        return 0.0
    
    total_difficulty = sum(task["difficulty"] for task in tasks)
    completed_difficulty = sum(
        task["difficulty"] for task in tasks if task["is_completed"]
    )
    
    # Handle edge case: avoid division by zero
    if total_difficulty == 0:
        return 0.0
    
    efficiency = (completed_difficulty / total_difficulty) * 100
    return round(efficiency, 1)


def _create_base64_image(fig):

    buffer = io.BytesIO()
    fig.savefig(buffer, format='png', dpi=100, bbox_inches='tight', 
                facecolor='#1a1a2e', edgecolor='none')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    buffer.close()
    plt.close(fig)
    return image_base64


def generate_difficulty_pie_chart(tasks):
    # Count tasks by difficulty level
    difficulty_counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    for task in tasks:
        difficulty_counts[task["difficulty"]] += 1
    
    # Filter out zero counts
    labels = []
    sizes = []
    colors = ['#00d4aa', '#00b4d8', '#4895ef', '#7b68ee', '#e040fb']
    filtered_colors = []
    
    difficulty_names = {
        1: 'Very Easy (1)',
        2: 'Easy (2)', 
        3: 'Medium (3)',
        4: 'Hard (4)',
        5: 'Very Hard (5)'
    }
    
    for diff, count in difficulty_counts.items():
        if count > 0:
            labels.append(difficulty_names[diff])
            sizes.append(count)
            filtered_colors.append(colors[diff - 1])
    
    # Create pie chart
    fig, ax = plt.subplots(figsize=(6, 5))
    fig.patch.set_facecolor('#1a1a2e')
    ax.set_facecolor('#1a1a2e')
    
    wedges, texts, autotexts = ax.pie(
        sizes, 
        labels=labels, 
        autopct='%1.1f%%',
        colors=filtered_colors,
        explode=[0.02] * len(sizes),
        shadow=True,
        startangle=90
    )
    
    # Style the text
    for text in texts:
        text.set_color('#caf0f8')
        text.set_fontsize(9)
    for autotext in autotexts:
        autotext.set_color('#1a1a2e')
        autotext.set_fontweight('bold')
        autotext.set_fontsize(9)
    
    ax.set_title('Task Difficulty Distribution', color='#caf0f8', fontsize=14, fontweight='bold', pad=15)
    
    return _create_base64_image(fig)


def generate_efficiency_gauge_chart(efficiency_score):
    """
    Generate a gauge/bar chart showing efficiency percentage.
    
    Args:
        efficiency_score: Float between 0 and 100
        
    Returns:
        str: Base64 encoded PNG image string
    """
    fig, ax = plt.subplots(figsize=(6, 4))
    fig.patch.set_facecolor('#1a1a2e')
    ax.set_facecolor('#1a1a2e')
    
    # Create horizontal bar gauge
    bar_width = 0.5
    
    # Background bar (represents 100%)
    ax.barh(0, 100, height=bar_width, color='#2d2d44', edgecolor='none')
    
    # Efficiency bar with gradient color based on score
    if efficiency_score >= 75:
        bar_color = '#00d4aa'  # Green - Excellent
    elif efficiency_score >= 50:
        bar_color = '#ffd60a'  # Yellow - Good
    elif efficiency_score >= 25:
        bar_color = '#ff9500'  # Orange - Fair
    else:
        bar_color = '#ff3b30'  # Red - Needs Improvement
    
    ax.barh(0, efficiency_score, height=bar_width, color=bar_color, edgecolor='none')
    
    # Add efficiency percentage text
    ax.text(50, 0, f'{efficiency_score}%', 
            ha='center', va='center', 
            fontsize=24, fontweight='bold', 
            color='#ffffff')
    
    # Add status text below
    if efficiency_score >= 75:
        status = "Excellent Performance! 🚀"
    elif efficiency_score >= 50:
        status = "Good Progress 👍"
    elif efficiency_score >= 25:
        status = "Room for Improvement 📈"
    else:
        status = "Needs Attention ⚠️"
    
    ax.text(50, -0.7, status, 
            ha='center', va='center', 
            fontsize=12, 
            color='#caf0f8')
    
    # Style the axes
    ax.set_xlim(0, 100)
    ax.set_ylim(-1.2, 0.8)
    ax.axis('off')
    
    ax.set_title('Weighted Efficiency Score', color='#caf0f8', fontsize=14, fontweight='bold', pad=20)
    
    # Add scale markers
    for x in [0, 25, 50, 75, 100]:
        ax.text(x, 0.45, str(x), ha='center', va='bottom', fontsize=8, color='#8892b0')
    
    return _create_base64_image(fig)


def generate_weekly_trend_chart(weekly_data):
    """
    Generate a line chart showing efficiency trend across the week.
    
    Args:
        weekly_data: Dict with day names as keys and efficiency scores as values
        
    Returns:
        str: Base64 encoded PNG image string
    """
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    day_abbrev = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    
    # Separate completed days from future days
    completed_days = []
    completed_scores = []
    future_days = []
    
    for i, day in enumerate(days):
        score = weekly_data.get(day)
        if score is not None:
            completed_days.append(i)
            completed_scores.append(score)
        else:
            future_days.append(i)
    
    fig, ax = plt.subplots(figsize=(8, 4))
    fig.patch.set_facecolor('#1a1a2e')
    ax.set_facecolor('#1a1a2e')
    
    # Plot the efficiency line
    if completed_scores:
        ax.plot(completed_days, completed_scores, 
                color='#00d4aa', linewidth=2.5, marker='o', 
                markersize=8, markerfacecolor='#00d4aa', markeredgecolor='#ffffff',
                markeredgewidth=2, label='Efficiency %', zorder=5)
        
        # Fill area under the curve
        ax.fill_between(completed_days, completed_scores, alpha=0.2, color='#00d4aa')
        
        # Add value labels on points
        for x, y in zip(completed_days, completed_scores):
            ax.annotate(f'{y}%', (x, y), textcoords="offset points", 
                        xytext=(0, 12), ha='center', fontsize=9, 
                        color='#ffffff', fontweight='bold')
    
    # Style the grid
    ax.set_xlim(-0.5, 6.5)
    ax.set_ylim(0, 110)
    ax.set_xticks(range(7))
    ax.set_xticklabels(day_abbrev, color='#caf0f8', fontsize=10)
    ax.set_ylabel('Efficiency %', color='#caf0f8', fontsize=11)
    
    # Add horizontal reference lines
    for y in [25, 50, 75, 100]:
        ax.axhline(y=y, color='#2d2d44', linestyle='--', linewidth=0.8, alpha=0.7)
    
    # Add "Today" marker
    if completed_days:
        today_idx = completed_days[-1]
        ax.axvline(x=today_idx, color='#4895ef', linestyle=':', linewidth=1.5, alpha=0.8)
        ax.text(today_idx, 105, 'Today', ha='center', va='bottom', 
                fontsize=9, color='#4895ef', fontweight='bold')
    
    # Gray out future days
    for idx in future_days:
        ax.axvspan(idx - 0.4, idx + 0.4, alpha=0.15, color='#8892b0')
    
    # Style axes
    ax.tick_params(axis='y', colors='#8892b0')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['bottom'].set_color('#2d2d44')
    ax.spines['left'].set_color('#2d2d44')
    
    ax.set_title('Weekly Efficiency Trend', color='#caf0f8', fontsize=14, fontweight='bold', pad=15)
    
    plt.tight_layout()
    return _create_base64_image(fig)


def generate_charts(tasks, efficiency_score, weekly_data):
    """
    Generate all charts for the productivity widget.
    
    Args:
        tasks: List of task dictionaries
        efficiency_score: Calculated efficiency percentage
        weekly_data: Weekly efficiency history
        
    Returns:
        dict: Contains base64 strings for all charts
    """
    return {
        "difficulty_pie_base64": generate_difficulty_pie_chart(tasks),
        "efficiency_bar_base64": generate_efficiency_gauge_chart(efficiency_score),
        "weekly_trend_base64": generate_weekly_trend_chart(weekly_data)
    }




# API ROUTES

@app.route('/api/productivity-stats', methods=['GET'])
def get_productivity_stats():
    """
    API endpoint that returns productivity statistics and charts.
    
    Returns JSON with:
    - efficiency_score: Weighted efficiency percentage
    - total_tasks: Total number of tasks
    - completed_tasks: Number of completed tasks
    - charts: Base64 encoded chart images
    """
    try:
        # Get mock data
        tasks = get_mock_tasks()
        weekly_data = get_mock_weekly_efficiency()
        
        # Calculate statistics
        efficiency_score = calculate_weighted_efficiency(tasks)
        total_tasks = len(tasks)
        completed_tasks = sum(1 for task in tasks if task["is_completed"])
        
        # Generate charts (including weekly trend)
        charts = generate_charts(tasks, efficiency_score, weekly_data)
        
        return jsonify({
            "status": "success",
            "data": {
                "efficiency_score": efficiency_score,
                "total_tasks": total_tasks,
                "completed_tasks": completed_tasks,
                "weekly_efficiency": weekly_data,
                "charts": charts
            }
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "service": "productivity-widget-api"})


# MAIN
if __name__ == '__main__':
    print("🚀 Starting Productivity Widget API...")
    print("📊 Endpoints:")
    print("   - GET /api/productivity-stats")
    print("   - GET /api/health")
    print("")
    app.run(debug=True, host='0.0.0.0', port=5001)
