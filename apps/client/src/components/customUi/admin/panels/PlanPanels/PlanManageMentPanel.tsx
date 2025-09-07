import { Button } from '@client/components/ui/button';
import { Card, CardContent, CardHeader } from '@client/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@client/components/ui/dialog';
import { Input } from '@client/components/ui/input';
import { Label } from '@client/components/ui/label';
import { Textarea } from '@client/components/ui/textarea';
import { Edit, Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@client/components/ui/select';
import { usePlanManageMentPanelHook } from '@client/hooks/PageHooks/admin/Plan/usePlanManageMentPanelHook';

function PlanManageMentPanel({ selectedChild }: { selectedChild: string }) {
  const {
    editingPlan,
    errorMessage,
    formData,
    handleCloseModal,
    handleInputChange,
    handleOpenModal,
    handleSave,
    isModalOpen,
    plans,
    setIsModalOpen,
  } = usePlanManageMentPanelHook(selectedChild);

  return (
    <div className="w-full mx-auto px-6 pb-6 overflow-auto custom-scrollbar">
      {/* Header with Add Plan button */}
      <div className="flex justify-between items-center pt-6 pb-3 mb-8 sticky top-0 z-10 bg-[#F3F3F3] ">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {selectedChild === 'subscription'
              ? 'Subscription Plans'
              : selectedChild === 'paid_group'
              ? 'Paid Groups Plan'
              : 'Exclusive User Plan'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {selectedChild === 'subscription'
              ? 'Manage your subscription offerings'
              : selectedChild === 'paid_group'
              ? 'Manage your Paid Groups Plan'
              : 'Manage your Exclusive User Plan'}
          </p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            {selectedChild === 'subscription' && (
              <Button
                onClick={() => handleOpenModal()}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Plan
              </Button>
            )}
          </DialogTrigger>

          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPlan
                  ? 'Edit Subscription Plan'
                  : 'Add New Subscription Plan'}
              </DialogTitle>
            </DialogHeader>

            <div>
              <div className="text-sm text-red-800 text-center">
                {errorMessage}
              </div>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Plan Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter plan name"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange('description', e.target.value)
                    }
                    placeholder="Describe the plan features and benefits"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        handleInputChange(
                          'price',
                          Number.parseFloat(e.target.value)
                        )
                      }
                      placeholder="0.00"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="offerPrice">Offer Price (₹)</Label>
                    <Input
                      id="offerPrice"
                      type="number"
                      step="0.01"
                      value={formData.offerPrice}
                      onChange={(e) =>
                        handleInputChange(
                          'offerPrice',
                          Number.parseFloat(e.target.value)
                        )
                      }
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {selectedChild === 'subscription' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="duration">Duration (Days)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) =>
                          handleInputChange(
                            'duration',
                            Number.parseFloat(e.target.value)
                          )
                        }
                        placeholder="Duration in Days"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="isActive">Status</Label>
                      <Select
                        value={formData.isActive ? 'true' : 'false'}
                        onValueChange={(value) =>
                          handleInputChange('isActive', value === 'true')
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue>
                            {formData.isActive ? 'Active' : 'Inactive'}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingPlan ? 'Update Plan' : 'Save Plan'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {plans.map((plan) => (
          <Card
            key={plan._id}
            className="relative group hover:shadow-lg transition-all duration-200 rounded-[6px] border border-border"
          >
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-3 z-10 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
              onClick={() => handleOpenModal(plan)}
            >
              <Edit className="h-4 w-4" />
            </Button>

            <CardHeader className="pb-4">
              <div className="space-y-2">
                <div className="space-y-2 flex items-center  gap-2">
                  <h3 className="text-xl font-bold text-foreground">
                    {plan.name}
                  </h3>

                  {plan.isActive && (
                    <span className="text-xs  bg-green-100 -translate-y-1 text-green-800 px-2 py-0.5 rounded-full font-medium">
                      Active
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary">
                    ₹{plan.offerPrice}
                  </span>
                  {plan.price !== plan.offerPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{plan.price}
                    </span>
                  )}
                  {selectedChild === 'subscription' && (
                    <span className="text-sm text-muted-foreground">
                      / {plan.duration} days
                    </span>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {plan.description}
              </p>

              <div className="text-xs text-muted-foreground">
                Created: {new Date(plan.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {plans.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            {selectedChild === 'subscription'
              ? 'No subscription plans found.'
              : selectedChild === 'paid_group'
              ? 'No Paid Groups Plan found.'
              : 'No Exclusive User Plan found.'}
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            Click "Add Plan" to create your first subscription plan.
          </p>
        </div>
      )}
    </div>
  );
}

export default PlanManageMentPanel;
